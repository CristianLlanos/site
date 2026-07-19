import Foundation
import Vision
import CoreImage
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

guard CommandLine.arguments.count == 3 else {
    fputs("usage: person_mask <input-image> <output-mask.png>\n", stderr)
    exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])

guard let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
      let sourceImage = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    fatalError("Cannot read input image")
}

let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8

let handler = VNImageRequestHandler(cgImage: sourceImage, options: [:])
try handler.perform([request])

guard let observation = request.results?.first else {
    fatalError("No person mask returned")
}

let mask = CIImage(cvPixelBuffer: observation.pixelBuffer)
let scaleX = CGFloat(sourceImage.width) / mask.extent.width
let scaleY = CGFloat(sourceImage.height) / mask.extent.height
let scaled = mask.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))
let targetRect = CGRect(x: 0, y: 0, width: sourceImage.width, height: sourceImage.height)

let context = CIContext(options: [.useSoftwareRenderer: false])
guard let outputImage = context.createCGImage(scaled, from: targetRect) else {
    fatalError("Cannot render mask")
}

guard let destination = CGImageDestinationCreateWithURL(
    outputURL as CFURL,
    UTType.png.identifier as CFString,
    1,
    nil
) else {
    fatalError("Cannot create output")
}

CGImageDestinationAddImage(destination, outputImage, nil)
guard CGImageDestinationFinalize(destination) else {
    fatalError("Cannot write mask")
}

print("Wrote \(outputURL.path) (\(sourceImage.width)x\(sourceImage.height))")
