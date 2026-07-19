import Foundation
import Vision
import CoreImage
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
import CoreVideo

enum CutoutError: Error {
    case loadImage
    case bitmapContext
    case noPerson
    case makeImage
    case writeImage
}

func pointInPolygon(_ x: Double, _ y: Double, _ polygon: [(Double, Double)]) -> Bool {
    var inside = false
    var j = polygon.count - 1
    for i in 0..<polygon.count {
        let (xi, yi) = polygon[i]
        let (xj, yj) = polygon[j]
        let intersects = ((yi > y) != (yj > y)) &&
            (x < (xj - xi) * (y - yi) / ((yj - yi) == 0 ? 0.000001 : (yj - yi)) + xi)
        if intersects { inside.toggle() }
        j = i
    }
    return inside
}

func makeGrayImage(_ bytes: [UInt8], width: Int, height: Int) throws -> CGImage {
    guard let provider = CGDataProvider(data: Data(bytes) as CFData),
          let image = CGImage(
            width: width,
            height: height,
            bitsPerComponent: 8,
            bitsPerPixel: 8,
            bytesPerRow: width,
            space: CGColorSpaceCreateDeviceGray(),
            bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.none.rawValue),
            provider: provider,
            decode: nil,
            shouldInterpolate: true,
            intent: .defaultIntent
          ) else { throw CutoutError.makeImage }
    return image
}

func makeRGBAImage(_ bytes: [UInt8], width: Int, height: Int) throws -> CGImage {
    guard let provider = CGDataProvider(data: Data(bytes) as CFData),
          let image = CGImage(
            width: width,
            height: height,
            bitsPerComponent: 8,
            bitsPerPixel: 32,
            bytesPerRow: width * 4,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue),
            provider: provider,
            decode: nil,
            shouldInterpolate: true,
            intent: .defaultIntent
          ) else { throw CutoutError.makeImage }
    return image
}

func writePNG(_ image: CGImage, to url: URL) throws {
    guard let destination = CGImageDestinationCreateWithURL(
        url as CFURL,
        UTType.png.identifier as CFString,
        1,
        nil
    ) else { throw CutoutError.writeImage }
    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else { throw CutoutError.writeImage }
}

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
    fputs("Usage: source-preserving-cutout <input.jpg> <output.png>\n", stderr)
    exit(2)
}

let inputURL = URL(fileURLWithPath: arguments[1])
let outputURL = URL(fileURLWithPath: arguments[2])

guard let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
      let sourceImage = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    throw CutoutError.loadImage
}

let width = sourceImage.width
let height = sourceImage.height

var rgba = [UInt8](repeating: 0, count: width * height * 4)
let rendered = rgba.withUnsafeMutableBytes { rawBuffer -> Bool in
    guard let context = CGContext(
        data: rawBuffer.baseAddress,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: width * 4,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
    ) else { return false }
    context.draw(sourceImage, in: CGRect(x: 0, y: 0, width: width, height: height))
    return true
}
guard rendered else { throw CutoutError.bitmapContext }

let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8
let handler = VNImageRequestHandler(cgImage: sourceImage, orientation: .up, options: [:])
try handler.perform([request])
guard let observation = request.results?.first else { throw CutoutError.noPerson }
let pixelBuffer = observation.pixelBuffer

CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
let maskWidth = CVPixelBufferGetWidth(pixelBuffer)
let maskHeight = CVPixelBufferGetHeight(pixelBuffer)
let maskStride = CVPixelBufferGetBytesPerRow(pixelBuffer)
let maskBase = CVPixelBufferGetBaseAddress(pixelBuffer)!.assumingMemoryBound(to: UInt8.self)
var rawMask = [UInt8](repeating: 0, count: maskWidth * maskHeight)
for y in 0..<maskHeight {
    for x in 0..<maskWidth {
        rawMask[y * maskWidth + x] = maskBase[y * maskStride + x]
    }
}
CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)

// Keep only the largest connected person component so background guests are discarded.
var labels = [Int32](repeating: 0, count: maskWidth * maskHeight)
var componentSizes = [Int](repeating: 0, count: 1)
var nextLabel: Int32 = 0
let neighbors = [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]
for y in 0..<maskHeight {
    for x in 0..<maskWidth {
        let index = y * maskWidth + x
        if rawMask[index] < 48 || labels[index] != 0 { continue }
        nextLabel += 1
        var queue = [index]
        labels[index] = nextLabel
        var cursor = 0
        while cursor < queue.count {
            let current = queue[cursor]
            cursor += 1
            let cx = current % maskWidth
            let cy = current / maskWidth
            for (dx, dy) in neighbors {
                let nx = cx + dx
                let ny = cy + dy
                if nx < 0 || ny < 0 || nx >= maskWidth || ny >= maskHeight { continue }
                let ni = ny * maskWidth + nx
                if rawMask[ni] >= 48 && labels[ni] == 0 {
                    labels[ni] = nextLabel
                    queue.append(ni)
                }
            }
        }
        componentSizes.append(queue.count)
    }
}

guard let largestLabel = componentSizes.indices.dropFirst().max(by: { componentSizes[$0] < componentSizes[$1] }) else {
    throw CutoutError.noPerson
}
let selectedLabel = Int32(largestLabel)
var selectedMask = [UInt8](repeating: 0, count: maskWidth * maskHeight)
for i in selectedMask.indices where labels[i] == selectedLabel {
    selectedMask[i] = rawMask[i]
}

// Bilinearly scale the soft Vision matte to the original photo size.
var alpha = [UInt8](repeating: 0, count: width * height)
for y in 0..<height {
    let fy = Double(y) * Double(maskHeight - 1) / Double(max(1, height - 1))
    let y0 = Int(floor(fy))
    let y1 = min(maskHeight - 1, y0 + 1)
    let wy = fy - Double(y0)
    for x in 0..<width {
        let fx = Double(x) * Double(maskWidth - 1) / Double(max(1, width - 1))
        let x0 = Int(floor(fx))
        let x1 = min(maskWidth - 1, x0 + 1)
        let wx = fx - Double(x0)
        let a00 = Double(selectedMask[y0 * maskWidth + x0])
        let a10 = Double(selectedMask[y0 * maskWidth + x1])
        let a01 = Double(selectedMask[y1 * maskWidth + x0])
        let a11 = Double(selectedMask[y1 * maskWidth + x1])
        let top = a00 * (1 - wx) + a10 * wx
        let bottom = a01 * (1 - wx) + a11 * wx
        alpha[y * width + x] = UInt8(max(0, min(255, top * (1 - wy) + bottom * wy)))
    }
}

// Shirt polygon is deliberately confined below the neck and above the belt.
let shirtPolygon: [(Double, Double)] = [
    (0.435, 0.235), (0.565, 0.235),
    (0.700, 0.285), (0.720, 0.350),
    (0.670, 0.395), (0.665, 0.505),
    (0.370, 0.505), (0.360, 0.400),
    (0.275, 0.370), (0.295, 0.300)
]

for y in 0..<height {
    let ny = Double(y) / Double(height)
    for x in 0..<width {
        let a = alpha[y * width + x]
        if a < 24 { continue }
        let nx = Double(x) / Double(width)
        if !pointInPolygon(nx, ny, shirtPolygon) { continue }
        // Preserve only the brighter metallic necklace pixels along its U-shaped path.
        let chainDX = abs(nx - 0.505) / 0.075
        var preserveMetal = false
        if chainDX <= 1.0 {
            let chainY = 0.315 - 0.075 * chainDX * chainDX
            if abs(ny - chainY) < 0.012 {
                let pi = (y * width + x) * 4
                let pr = Double(rgba[pi])
                let pg = Double(rgba[pi + 1])
                let pb = Double(rgba[pi + 2])
                let pl = 0.2126 * pr + 0.7152 * pg + 0.0722 * pb
                preserveMetal = pl > 65 && (pr - pg) > 8 && (pg - pb) > 5
            }
        }
        if preserveMetal { continue }
        let i = (y * width + x) * 4
        let r = Double(rgba[i])
        let g = Double(rgba[i + 1])
        let b = Double(rgba[i + 2])
        let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
        let darkFabric = r < 125 && g < 108 && b < 102 && luminance < 105 && r > g * 1.12
        if darkFabric {
            let desiredLuminance = max(16.0, min(112.0, luminance * 1.45 + 8.0))
            let scale = desiredLuminance / 59.4
            let petrolR = max(0.0, min(255.0, 3.0 * scale))
            let petrolG = max(0.0, min(255.0, 75.0 * scale))
            let petrolB = max(0.0, min(255.0, 79.0 * scale))
            rgba[i] = UInt8(0.08 * r + 0.92 * petrolR)
            rgba[i + 1] = UInt8(0.08 * g + 0.92 * petrolG)
            rgba[i + 2] = UInt8(0.08 * b + 0.92 * petrolB)
        }
    }
}

var minX = width, minY = height, maxX = 0, maxY = 0
for y in 0..<height {
    for x in 0..<width where alpha[y * width + x] > 18 {
        minX = min(minX, x)
        minY = min(minY, y)
        maxX = max(maxX, x)
        maxY = max(maxY, y)
    }
}
guard minX <= maxX && minY <= maxY else { throw CutoutError.noPerson }

let padding = 90
minX = max(0, minX - padding)
minY = max(0, minY - padding)
maxX = min(width - 1, maxX + padding)
maxY = min(height - 1, maxY + padding)
let cropWidth = maxX - minX + 1
let cropHeight = maxY - minY + 1

var croppedRGBA = [UInt8](repeating: 0, count: cropWidth * cropHeight * 4)
var croppedMask = [UInt8](repeating: 0, count: cropWidth * cropHeight)
for y in 0..<cropHeight {
    for x in 0..<cropWidth {
        let sourceX = minX + x
        let sourceY = minY + y
        let sourceIndex = sourceY * width + sourceX
        let a = alpha[sourceIndex]
        croppedMask[y * cropWidth + x] = a
        let si = sourceIndex * 4
        let di = (y * cropWidth + x) * 4
        let factor = Double(a) / 255.0
        croppedRGBA[di] = UInt8(Double(rgba[si]) * factor)
        croppedRGBA[di + 1] = UInt8(Double(rgba[si + 1]) * factor)
        croppedRGBA[di + 2] = UInt8(Double(rgba[si + 2]) * factor)
        croppedRGBA[di + 3] = a
    }
}

let subjectCG = try makeRGBAImage(croppedRGBA, width: cropWidth, height: cropHeight)
let maskCG = try makeGrayImage(croppedMask, width: cropWidth, height: cropHeight)
let extent = CGRect(x: 0, y: 0, width: cropWidth, height: cropHeight)
let ciContext = CIContext(options: [.useSoftwareRenderer: false])
let clear = CIImage(color: CIColor(red: 0, green: 0, blue: 0, alpha: 0)).cropped(to: extent)
let maskImage = CIImage(cgImage: maskCG)
let subjectImage = CIImage(cgImage: subjectCG)

func coloredLayer(color: CIColor, mask: CIImage) -> CIImage {
    let solid = CIImage(color: color).cropped(to: extent)
    return solid.applyingFilter("CIBlendWithAlphaMask", parameters: [
        kCIInputBackgroundImageKey: clear,
        kCIInputMaskImageKey: mask.applyingFilter("CIMaskToAlpha")
    ]).cropped(to: extent)
}

let glowMask = maskImage
    .clampedToExtent()
    .applyingFilter("CIGaussianBlur", parameters: [kCIInputRadiusKey: 16.0])
    .cropped(to: extent)
let glow = coloredLayer(color: CIColor(red: 0.08, green: 0.26, blue: 0.43, alpha: 0.30), mask: glowMask)
let outlineMask = maskImage.applyingFilter("CIMorphologyMaximum", parameters: [kCIInputRadiusKey: 4.0])
let outline = coloredLayer(color: CIColor(red: 0.86, green: 0.63, blue: 0.36, alpha: 0.98), mask: outlineMask)
let composition = subjectImage.composited(over: outline.composited(over: glow.composited(over: clear)))

guard let finalImage = ciContext.createCGImage(composition, from: extent) else {
    throw CutoutError.makeImage
}
try writePNG(finalImage, to: outputURL)
print("Wrote \(outputURL.path) (\(cropWidth)x\(cropHeight))")
