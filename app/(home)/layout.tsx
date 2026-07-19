import Footer from '@/components/footer'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-container">
      {children}
      <Footer />
    </div>
  )
}
