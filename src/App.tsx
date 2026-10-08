import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { updatePageMeta } from './utils/seo';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SeoCaseStudiesPage } from './pages/SeoCaseStudiesPage';
import { ProcessPage } from './pages/ProcessPage';
import { BlogPage } from './pages/BlogPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { StartProjectPage } from './pages/StartProjectPage';
import { SearchPage } from './pages/SearchPage';
import { WordPressHubPage } from './pages/WordPressHubPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [route, setRoute] = useState<PageRoute>('home');
  const [slug, setSlug] = useState<string | undefined>(undefined);
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync hash with route state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash || hash === '') {
        setRoute('home');
        setSlug(undefined);
        return;
      }

      const parts = hash.split('/');
      const main = parts[0];
      const sub = parts[1];

      if (main === 'about') {
        setRoute('about');
        setSlug(undefined);
      } else if (main === 'services') {
        if (sub) {
          setRoute('service-detail');
          setSlug(sub);
        } else {
          setRoute('services');
          setSlug(undefined);
        }
      } else if (main === 'portfolio') {
        setRoute('portfolio');
        setSlug(sub); // Supports sub-routes like web-design
      } else if (main === 'projects') {
        if (sub) {
          setRoute('project-detail');
          setSlug(sub);
        } else {
          setRoute('portfolio');
          setSlug(undefined);
        }
      } else if (main === 'seo') {
        setRoute('seo');
        setSlug(sub); // Supports sub-routes like case-studies
      } else if (main === 'process') {
        setRoute('process');
        setSlug(undefined);
      } else if (main === 'blog') {
        if (sub) {
          setRoute('article-detail');
          setSlug(sub);
        } else {
          setRoute('blog');
          setSlug(undefined);
        }
      } else if (main === 'faq') {
        setRoute('faq');
        setSlug(undefined);
      } else if (main === 'contact') {
        setRoute('contact');
        setSlug(undefined);
      } else if (main === 'start-project') {
        setRoute('start-project');
        setSlug(undefined);
      } else if (main === 'search') {
        setRoute('search');
        setSlug(undefined);
      } else if (main === 'wordpress-hub' || main === 'wp-admin' || main === 'wordpress') {
        setRoute('wordpress-hub');
        setSlug(undefined);
      } else if (main === 'privacy') {
        setRoute('privacy');
        setSlug(undefined);
      } else if (main === 'terms') {
        setRoute('terms');
        setSlug(undefined);
      } else {
        setRoute('404');
        setSlug(undefined);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update dynamic page meta title & description for SEO
  useEffect(() => {
    updatePageMeta(route, slug);
  }, [route, slug]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (newRoute: PageRoute, newSlug?: string) => {
    setRoute(newRoute);
    setSlug(newSlug);

    // Update URL hash
    let hashTarget = '';
    if (newRoute === 'home') hashTarget = '';
    else if (newRoute === 'about') hashTarget = 'about';
    else if (newRoute === 'services') hashTarget = 'services';
    else if (newRoute === 'service-detail') hashTarget = `services/${newSlug || ''}`;
    else if (newRoute === 'portfolio') hashTarget = newSlug ? `portfolio/${newSlug}` : 'portfolio';
    else if (newRoute === 'project-detail') hashTarget = `projects/${newSlug || ''}`;
    else if (newRoute === 'seo') hashTarget = newSlug ? `seo/${newSlug}` : 'seo';
    else if (newRoute === 'process') hashTarget = 'process';
    else if (newRoute === 'blog') hashTarget = 'blog';
    else if (newRoute === 'article-detail') hashTarget = `blog/${newSlug || ''}`;
    else if (newRoute === 'faq') hashTarget = 'faq';
    else if (newRoute === 'contact') hashTarget = 'contact';
    else if (newRoute === 'start-project') hashTarget = 'start-project';
    else if (newRoute === 'search') hashTarget = 'search';
    else if (newRoute === 'wordpress-hub') hashTarget = 'wordpress-hub';
    else if (newRoute === 'privacy') hashTarget = 'privacy';
    else if (newRoute === 'terms') hashTarget = 'terms';
    else if (newRoute === '404') hashTarget = '404';

    window.location.hash = hashTarget ? `#/${hashTarget}` : '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (route) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'services':
        return <ServicesPage onNavigate={navigate} />;
      case 'service-detail':
        return <ServiceDetailPage slug={slug || 'web-design'} onNavigate={navigate} />;
      case 'portfolio':
        return <PortfolioPage filterSlug={slug} onNavigate={navigate} />;
      case 'project-detail':
        return <ProjectDetailPage slug={slug || 'arya-capital'} onNavigate={navigate} />;
      case 'seo':
        return <SeoCaseStudiesPage onNavigate={navigate} />;
      case 'process':
        return <ProcessPage onNavigate={navigate} />;
      case 'blog':
        return <BlogPage onNavigate={navigate} />;
      case 'article-detail':
        return <ArticleDetailPage slug={slug || 'why-slow-websites-destroy-trust'} onNavigate={navigate} />;
      case 'faq':
        return <FaqPage onNavigate={navigate} />;
      case 'contact':
        return <ContactPage onNavigate={navigate} />;
      case 'start-project':
        return <StartProjectPage onNavigate={navigate} />;
      case 'search':
        return <SearchPage onNavigate={navigate} />;
      case 'wordpress-hub':
        return <WordPressHubPage onNavigate={navigate} />;
      case 'privacy':
        return <LegalPage type="privacy" onNavigate={navigate} />;
      case 'terms':
        return <LegalPage type="terms" onNavigate={navigate} />;
      case '404':
      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#03070D] text-[#C5D0DD] antialiased">
      <Header
        currentRoute={route}
        currentSlug={slug}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <Footer onNavigate={navigate} />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
}
