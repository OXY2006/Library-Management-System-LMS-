import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, Brain, BarChart3, Shield, Sparkles, Users,
  ChevronRight, Star, ArrowRight, Zap, Target, Clock,
  Github, Twitter, Linkedin, Mail, BookMarked, TrendingUp,
  ScanLine, MessageSquare
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();

  const features = [
    { icon: Brain, title: 'AI Recommendations', desc: 'Smart book suggestions powered by collaborative filtering and reading pattern analysis.', color: 'from-violet-500 to-purple-600' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Beautiful dashboards with real-time insights into borrowing trends and member activity.', color: 'from-blue-500 to-cyan-600' },
    { icon: Shield, title: 'Smart Predictions', desc: 'AI-powered late return prediction and fine estimation with risk assessment.', color: 'from-emerald-500 to-teal-600' },
    { icon: ScanLine, title: 'QR Code Scanning', desc: 'Instant book issue and return with modern barcode and QR code scanning.', color: 'from-orange-500 to-red-600' },
    { icon: MessageSquare, title: 'Reviews & Ratings', desc: 'Community-driven book reviews with sentiment analysis and helpful voting.', color: 'from-pink-500 to-rose-600' },
    { icon: TrendingUp, title: 'Demand Forecasting', desc: 'Predict book availability and demand patterns to optimize your library inventory.', color: 'from-amber-500 to-orange-600' },
  ];

  const steps = [
    { num: '01', title: 'Add Your Library', desc: 'Import your book catalog and member database in minutes.' },
    { num: '02', title: 'Let AI Analyze', desc: 'Our algorithms learn patterns from borrowing history and ratings.' },
    { num: '03', title: 'Get Insights', desc: 'Receive predictions, recommendations, and actionable analytics.' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Head Librarian, Metro Library', quote: 'LibraryAI reduced our overdue books by 40% with its prediction system. The dashboard is absolutely beautiful.', rating: 5 },
    { name: 'James Rodriguez', role: 'Director, University Library', quote: 'The AI recommendations have increased book circulation by 65%. Students love the personalized suggestions.', rating: 5 },
    { name: 'Emily Watson', role: 'Library Manager, City Library', quote: 'The analytics dashboard gives us insights we never had before. It\'s like having a data scientist on the team.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-200/50 dark:border-surface-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-surface-900 dark:text-white">Library<span className="gradient-text">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              {isDark ? <Sparkles className="w-5 h-5 text-amber-400" /> : <Sparkles className="w-5 h-5 text-surface-500" />}
            </button>
            <Link to="/dashboard" className="btn-primary text-sm">View Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div className="text-center max-w-4xl mx-auto" initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-full px-4 py-1.5 mb-8">
              <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Powered by Advanced AI</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-extrabold font-display leading-tight mb-6">
              <span className="text-surface-900 dark:text-white">AI-Powered Smart</span>
              <br />
              <span className="gradient-text">Library Management</span>
              <br />
              <span className="text-surface-900 dark:text-white">System</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-10 text-balance">
              Manage books, members, analytics and predictions with intelligent automation. Transform your library with cutting-edge AI technology.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="btn-primary text-base flex items-center gap-2 group">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/dashboard" className="btn-secondary text-base flex items-center gap-2">
                View Dashboard
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Illustration - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 md:mt-24 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-violet-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              <div className="relative glass rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden shadow-2xl">
                {/* Mock Dashboard Preview */}
                <div className="bg-surface-50 dark:bg-surface-800 p-1">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 text-center">
                      <div className="inline-block bg-surface-200 dark:bg-surface-700 rounded-lg px-4 py-1 text-xs text-surface-500">libraryai.app/dashboard</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-surface-900 p-8">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Total Books', value: '12,847', trend: '+12%', color: 'text-primary-600' },
                      { label: 'Active Members', value: '3,456', trend: '+8%', color: 'text-emerald-600' },
                      { label: 'Books Issued', value: '892', trend: '+15%', color: 'text-violet-600' },
                      { label: 'AI Accuracy', value: '94.7%', trend: '+3%', color: 'text-amber-600' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-surface-50 dark:bg-surface-800 rounded-xl p-4">
                        <p className="text-xs text-surface-500 mb-1">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-emerald-500 mt-1">↑ {stat.trend}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-surface-50 dark:bg-surface-800 rounded-xl p-4 h-40">
                      <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Borrowing Trends</p>
                      <div className="flex items-end gap-2 h-24">
                        {[40, 55, 35, 65, 50, 75, 60, 80, 70, 85, 90, 95].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-4 h-40">
                      <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Genre Split</p>
                      <div className="flex items-center justify-center h-24">
                        <div className="w-20 h-20 rounded-full border-8 border-primary-500 border-t-violet-500 border-r-emerald-500 border-b-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface-50 dark:bg-surface-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">Features</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold font-display text-surface-900 dark:text-white mb-4">
              Everything you need to manage
              <br />
              <span className="gradient-text">a modern library</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
              Built with AI at its core, LibraryAI provides intelligent tools that transform how libraries operate.
            </motion.p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="glass-card-hover group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">How It Works</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold font-display text-surface-900 dark:text-white mb-4">
              Get started in <span className="gradient-text">three simple steps</span>
            </motion.h2>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="relative">
                <div className="glass-card text-center">
                  <div className="text-6xl font-extrabold gradient-text opacity-30 mb-4">{step.num}</div>
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-surface-500 dark:text-surface-400">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-primary-300 dark:text-primary-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section className="py-24 bg-surface-50 dark:bg-surface-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="grid lg:grid-cols-2 gap-16 items-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">AI Capabilities</p>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-surface-900 dark:text-white mb-6">
                Intelligent automation that <span className="gradient-text">learns & adapts</span>
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 mb-8">
                Our AI modules continuously learn from your library's data to provide smarter recommendations, accurate predictions, and actionable insights.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Brain, text: 'Collaborative & content-based filtering for book recommendations' },
                  { icon: Target, text: 'Late return prediction with 94.7% accuracy' },
                  { icon: Clock, text: 'Real-time book availability forecasting' },
                  { icon: BarChart3, text: 'Automated analytics and trend detection' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="text-surface-600 dark:text-surface-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 to-violet-500/10 rounded-3xl blur-xl" />
              <div className="relative glass-card space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-surface-900 dark:text-white">AI Insight</h4>
                    <p className="text-xs text-surface-500">Updated 2 minutes ago</p>
                  </div>
                </div>
                {[
                  { label: 'Recommendation Accuracy', value: '94.7%', bar: 94.7 },
                  { label: 'Late Return Prediction', value: '91.2%', bar: 91.2 },
                  { label: 'Demand Forecast Score', value: '88.5%', bar: 88.5 },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-600 dark:text-surface-400">{metric.label}</span>
                      <span className="font-semibold text-surface-900 dark:text-white">{metric.value}</span>
                    </div>
                    <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full gradient-bg"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.bar}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    AI predicts a 23% increase in Fiction category demand next month.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">Testimonials</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold font-display text-surface-900 dark:text-white mb-4">
              Loved by <span className="gradient-text">librarians worldwide</span>
            </motion.h2>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="glass-card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-surface-600 dark:text-surface-300 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-surface-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
        </div>
        <motion.div
          className="relative max-w-4xl mx-auto px-6 text-center"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
            Ready to transform your library?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of librarians who are already using AI to create a better experience for their readers.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
              Get Started for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-950 text-surface-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold font-display text-white">Library<span className="text-primary-400">AI</span></span>
              </div>
              <p className="text-sm leading-relaxed">Smart library management powered by artificial intelligence. Making libraries smarter, one book at a time.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-primary-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex gap-3">
                {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-surface-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-surface-800 pt-8 text-center text-sm">
            <p>© 2024 LibraryAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
