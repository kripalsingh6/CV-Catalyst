import {FileText} from 'lucide-react'

export function Footer(){
    return(
        <footer className='bg-[#1a1a1f] border-t border-white/5'>
            <div className='max-w-6xl mx-auto px-6 md:px-10 py-16'>
                {/* main footer */}

                <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-12'>

                    {/* brand section */}
                    <div className='flex items-center gap-2 mb-3'>
                        <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center'>
                            <FileText className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-white">CV-Catalyst</span>
                    </div>
                    <p className="text-sm text-gray-400">
                     Build ATS-optimized resumes in seconds.
                    </p>

                </div>

                {/* product column */}
                <div>
                    <h4 className='text-white font-semibold text-sm mb-4'>Product</h4>
                     <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Templates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Security
                </a>
              </li>
            </ul>
                </div>

            </div>

        </footer>
    )
}