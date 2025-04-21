import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPoll, FaCloud, FaMobile, FaChartLine } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import '../styles/home.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <Navbar />
      
      <div className="hero-section">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            Create <span className="highlight">Interactive</span> Live Surveys
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtitle"
          >
            Engage your audience with real-time polls, word clouds, and quizzes
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/register" className="btn-primary">
              Get Started <span className="arrow">→</span>
            </Link>
            <Link to="/join" className="btn-secondary">
              Join a Survey
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="floating-ui floating-ui-1">
            <div className="ui-card">
              <div className="ui-question">Which feature do you like best?</div>
              <div className="ui-options">
                <div className="ui-option ui-option-highlight">Real-time Results</div>
                <div className="ui-option">Word Clouds</div>
                <div className="ui-option">Custom Themes</div>
              </div>
            </div>
          </div>
          
          <div className="floating-ui floating-ui-2">
            <div className="ui-results">
              <div className="ui-bar ui-bar-1"></div>
              <div className="ui-bar ui-bar-2"></div>
              <div className="ui-bar ui-bar-3"></div>
            </div>
          </div>

          <div className="floating-ui floating-ui-3">
            <div className="ui-participants">
              <div className="ui-participant-icon"></div>
              <div className="ui-participant-count">124</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="trusted-section">
        <div className="trusted-content">
          <p>Trusted by teams at</p>
          <div className="trusted-logos">
            <div className="logo-placeholder">Company 1</div>
            <div className="logo-placeholder">Company 2</div>
            <div className="logo-placeholder">Company 3</div>
            <div className="logo-placeholder">Company 4</div>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Powerful Features
        </motion.h2>
        
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <FaPoll />
            </div>
            <h3>Live Polling</h3>
            <p>Create polls and see responses in real-time with beautiful visuals</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <FaCloud />
            </div>
            <h3>Word Clouds</h3>
            <p>Generate beautiful word clouds from audience input that update in real-time</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <FaMobile />
            </div>
            <h3>Mobile Friendly</h3>
            <p>Participants can join from any device - no app download required</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Instant Results</h3>
            <p>View and share results instantly with multiple visualization options</p>
          </motion.div>
        </div>
      </div>
      
      <div className="demo-section">
        <div className="demo-content">
          <motion.div 
            className="demo-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>See it in action</h2>
            <p>Create engaging presentations with interactive elements that capture your audience's attention and provide valuable insights.</p>
            <Link to="/register" className="btn-primary">Try it free</Link>
          </motion.div>
          
          <motion.div 
            className="demo-image"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="browser-mockup">
              <div className="browser-header">
                <div className="browser-buttons">
                  <span className="browser-button"></span>
                  <span className="browser-button"></span>
                  <span className="browser-button"></span>
                </div>
                <div className="browser-address">quizlet.com/present</div>
              </div>
              <div className="browser-content">
                <div className="mockup-question">How satisfied are you with the product?</div>
                <div className="mockup-chart">
                  <div className="chart-bar" style={{height: '60%'}}></div>
                  <div className="chart-bar" style={{height: '80%'}}></div>
                  <div className="chart-bar" style={{height: '40%'}}></div>
                  <div className="chart-bar" style={{height: '90%'}}></div>
                  <div className="chart-bar" style={{height: '70%'}}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Ready to engage your audience?</h2>
          <p>Join thousands of presenters who have transformed their presentations.</p>
          <Link to="/register" className="btn-cta">Get Started For Free</Link>
        </motion.div>
      </div>
      
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Quizlet</h3> 
            <p>Interactive presentations made easy</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Templates</a></li>
                <li><a href="#">Plans</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Guides</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Quizlet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;