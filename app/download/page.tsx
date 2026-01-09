import SectionPage from '../components/SectionPage';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';

export default function DownloadPage() {
  return (
    <>
      <SiteHeader />
      <SectionPage title="Download" enableDownload />
      <SiteFooter />
    </>
  );
}
