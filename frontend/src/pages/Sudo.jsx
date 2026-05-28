import { Link } from 'react-router-dom'
import Typewriter from '../components/Typewriter'

const LINES = [
  'koded@os:~$ sudo access --root',
  '',
  'sudo: access denied.',
  'sudo: this system does not belong to you.',
  'sudo: incident will be reported.',
  '',
  '[sudo] password for koded: ••••••••',
  'Authentication failure.',
  '',
  '> nice try.',
]

export default function Sudo() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl">
        <Typewriter lines={LINES} speed={30} lineDelay={150} />
        <div className="mt-8">
          <Link to="/home" className="font-mono text-xs text-text-secondary hover:text-green-bright transition-colors">
            ← retreat to safety
          </Link>
        </div>
      </div>
    </div>
  )
}
