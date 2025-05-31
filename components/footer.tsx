"use client"

import Link from "next/link"
import { Film, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      className="bg-white/80 backdrop-blur-md border-t border-filmz-border mt-16 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and Copyright */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Film className="h-6 w-6 text-filmz-orange-light" />
            <span className="text-lg font-bold text-filmz-text-primary">Filmz</span>
            <span className="text-filmz-text-secondary">© 2025</span>
          </div>

          {/* Developer Link */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Link
              href="https://haider-portfolio-ten.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-filmz-text-secondary hover:text-filmz-orange-light transition-colors duration-200"
            >
              <span>Built by Haider</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}
