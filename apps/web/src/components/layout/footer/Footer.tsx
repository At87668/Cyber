import { ThemeSwitcher } from '~/components/ui/theme-switcher'
import { Link } from '~/i18n/navigation'

import { FooterInfo } from './FooterInfo'
import { LocaleSwitcher } from './LocaleSwitcher'

export const Footer = () => (
  <footer data-hide-print className="cyber-footer relative z-[1] mt-32 py-6">
    <div className="px-4 sm:px-8">
      <div className="relative mx-auto max-w-7xl lg:px-8">
        <FooterInfo />

        <div className="mt-6 flex flex-col items-center gap-4 md:absolute md:bottom-0 md:right-0 md:mt-0 md:flex-row">
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </div>

    <div className="cyber-footer__links" style={{ marginTop: 30 }}>
      <Link href="/">{'[ HOME_UPLINK ]'}</Link>
      <Link href="/posts">{'[ POSTS_NODE ]'}</Link>
      <Link href="/notes">{'[ NOTES_NODE ]'}</Link>
      <Link href="/friends">{'[ FRIENDS_LINK ]'}</Link>
    </div>

    <div className="cyber-footer__copy">
      {'> SYSTEM STATUS: ONLINE // END OF LINE'}
    </div>
  </footer>
)
