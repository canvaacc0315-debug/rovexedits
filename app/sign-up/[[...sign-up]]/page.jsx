import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--color-bg)' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(255, 70, 85, 0.15) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[#ff4655] hover:bg-[#ff4655]/90 text-sm normal-case',
              card: 'bg-[#0c0c12] border border-white/10 shadow-2xl rounded-2xl',
              headerTitle: 'font-display text-white',
              headerSubtitle: 'font-mono text-gray-400',
              socialButtonsBlockButton: 'border-white/10 hover:bg-white/5 text-white',
              dividerLine: 'bg-white/10',
              dividerText: 'text-gray-500',
              formFieldLabel: 'text-gray-300 font-mono text-xs',
              formFieldInput: 'bg-[#06060a] border-white/10 text-white focus:border-[#ff4655]',
              footerActionText: 'text-gray-400',
              footerActionLink: 'text-[#ff4655] hover:text-[#ff4655]/80',
            }
          }}
        />
      </div>
    </div>
  );
}
