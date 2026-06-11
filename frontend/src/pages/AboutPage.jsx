import React from 'react';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Icon from '../components/Icon';

const VALUES = [
  { icon: 'shield', title: 'Trust & Transparency',  desc: 'Complete honesty in every transaction. No hidden fees, no surprises.' },
  { icon: 'award',  title: 'Premium Quality',        desc: 'We only source from verified dealers and conduct thorough inspections.' },
  { icon: 'users',  title: 'Customer First',          desc: 'Your satisfaction drives everything we do. End-to-end support included.' },
  { icon: 'zap',    title: 'Efficiency',             desc: 'Streamlined import process. From selection to delivery in as little as 4 weeks.' },
];

const MILESTONES = [
  { year: '2015', title: 'Founded',               desc: 'Started as a small car import consultancy in Cairo.' },
  { year: '2017', title: 'First Major Milestone',  desc: 'Successfully imported 100 vehicles within first 2 years.' },
  { year: '2019', title: 'Partnership Network',    desc: 'Established direct partnerships with European dealers.' },
  { year: '2021', title: 'Digital Transformation', desc: 'Launched online platform for seamless car browsing.' },
  { year: '2024', title: '500+ Cars Delivered',    desc: 'Reached milestone of 500+ satisfied customers.' },
];

const DIFFERENCE = [
  'Direct partnerships with verified European dealers',
  'Comprehensive vehicle inspection before purchase',
  'Complete documentation and customs handling',
  'Transparent pricing with no hidden fees',
  'Full after-sale support and warranty options',
  'Flexible payment plans available',
];

export default function AboutPage() {
  return (
    <div className="ed-page">
      <TopBar />
      <NavBar />
      <main className="ed-main">

        {/* Header */}
        <div className="ed-page-header">
          <div className="ed-container">
            <div className="ed-label" style={{ marginBottom: 12 }}>About Us</div>
            <h1 className="ed-h1">Bringing European Excellence<br />to Egyptian Roads</h1>
            <p className="ed-lead" style={{ marginTop: 16 }}>
              Founded with a passion for quality automobiles, EuroDrive Egypt has become the premier
              destination for importing luxury European vehicles. We combine expertise, transparency,
              and exceptional service to make your dream car a reality.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <section className="ed-about-story">
          <div className="ed-container">
            <div className="ed-label">Our Story</div>
            <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 20 }}>A Decade of Excellence in Car Import</h2>
            <p className="ed-lead" style={{ marginBottom: 16 }}>
              What started as a small consultancy has grown into Egypt's most trusted car import service.
              Our founder, after experiencing the challenges of importing a personal vehicle, recognized
              the need for a transparent, professional service.
            </p>
            <p className="ed-lead">
              Today, we've helped hundreds of Egyptians own their dream European cars, from Mercedes-Benz
              and BMW to Audi and Porsche. Our team handles everything from sourcing to delivery,
              ensuring a seamless experience.
            </p>
            <div className="ed-about-stats">
              <div className="ed-about-stat">
                <div className="ed-about-stat-num">500+</div>
                <div className="ed-about-stat-label">Cars Delivered</div>
              </div>
              <div className="ed-about-stat">
                <div className="ed-about-stat-num">10+</div>
                <div className="ed-about-stat-label">Years Experience</div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo */}
        <img
          className="ed-about-photo"
          src="https://picsum.photos/seed/eurodrive-about/1200/400"
          alt="European cars"
        />

        {/* Core Values */}
        <section className="ed-values-section">
          <div className="ed-container">
            <div className="ed-label ed-center">What We Stand For</div>
            <h2 className="ed-h2 ed-center" style={{ marginTop: 8 }}>Our Core Values</h2>
            <div className="ed-values-list">
              {VALUES.map(v => (
                <div className="ed-card ed-value-card" key={v.title}>
                  <div className="ed-value-icon"><Icon name={v.icon} size={22} /></div>
                  <div className="ed-value-title">{v.title}</div>
                  <div className="ed-value-desc">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Milestones */}
        <section className="ed-milestones-section">
          <div className="ed-container">
            <div className="ed-label">Our Journey</div>
            <h2 className="ed-h2" style={{ marginTop: 8 }}>Key Milestones</h2>
            <div className="ed-milestones-list">
              {MILESTONES.map(m => (
                <div className="ed-milestone-item" key={m.year}>
                  <div className="ed-milestone-dot" />
                  <div>
                    <div className="ed-milestone-year">{m.year}</div>
                    <div className="ed-milestone-title">{m.title}</div>
                    <div className="ed-milestone-desc">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The EuroAuto Difference */}
        <section className="ed-difference-section">
          <div className="ed-container">
            <div className="ed-label">Why Choose Us</div>
            <h2 className="ed-h2" style={{ marginTop: 8 }}>The EuroAuto Difference</h2>
            <div className="ed-diff-list">
              {DIFFERENCE.map(d => (
                <div className="ed-diff-item" key={d}>
                  <span className="ed-diff-check"><Icon name="check-circle" size={18} /></span>
                  <span className="ed-diff-text">{d}</span>
                </div>
              ))}
            </div>
            <a href="#/vehicles" className="ed-btn ed-btn-dark ed-btn-lg">
              Browse Our Inventory →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
