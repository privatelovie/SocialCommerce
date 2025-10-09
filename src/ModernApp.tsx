import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  CssBaseline, 
  Snackbar, 
  Alert, 
  Fab,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocialProvider } from './context/SocialContext';
import { CartProvider, useCart } from './context/CartContext';

// Components
import Navigation from './components/Navigation';
import PostCard from './components/PostCard';
import CommentsDrawer from './components/CommentsDrawer';
import AIGuide from './components/AIGuide';
import VideoPromotion from './components/VideoPromotion';
import DirectMessages from './components/DirectMessages';
import EnhancedProfile from './components/EnhancedProfile';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CreatePost from './components/CreatePost';
import Settings from './components/Settings';
import ProductPage from './components/ProductPage';
import UserSearch from './components/UserSearch';

// Pages
import ExplorePage from './pages/ExplorePage';

// Services
import demoRealProducts from './services/demoRealProducts';

// Styles
import './styles/modern.css';

// Enhanced Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      dark: '#5a67d8',
      light: '#7c87f0',
    },
    secondary: {
      main: '#764ba2',
      dark: '#6b5b95',
      light: '#9b6ec9',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#718096',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '\"Inter\", \"Roboto\", \"Helvetica\", \"Arial\", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});

// Mock Social Posts
const mockSocialPosts = [
  {
    id: '1',
    user: {
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    content: 'Just discovered this amazing new tech gadget! The AI integration is mind-blowing 🤖✨ Perfect for productivity and entertainment. What do you all think? #AI #TechReview #Innovation',
    media: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop'],
    timestamp: '2 hours ago',
    likes: 1247,
    comments: 89,
    shares: 34,
    bookmarks: 156,
    isLiked: false,
    isBookmarked: false,
    hashtags: ['#AI', '#TechReview', '#Innovation'],
    product: {
      id: '1',
      name: 'Smart AI Assistant Device',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
      description: 'Revolutionary AI-powered smart device',
      rating: 4.8,
      reviewCount: 2847,
      brand: 'TechCorp',
      inStock: true
    }
  },
  {
    id: '2',
    user: {
      id: '2',
      username: 'sarah_style',
      displayName: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    content: 'Sustainable fashion haul! 🌱✨ These pieces are not only stylish but also eco-friendly. Supporting brands that care about our planet 💚 #SustainableFashion #EcoFriendly #Style',
    media: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=400&fit=crop'
    ],
    timestamp: '4 hours ago',
    likes: 892,
    comments: 67,
    shares: 23,
    bookmarks: 145,
    isLiked: true,
    isBookmarked: false,
    hashtags: ['#SustainableFashion', '#EcoFriendly', '#Style']
  }
];

// Authentication Modal Component
const AuthModal: React.FC<{
  open: boolean;
  onClose: () => void;
  type: 'login' | 'register';
  onToggleType: () => void;
}> = ({ open, onClose, type, onToggleType }) => {
  const { login, register, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'login') {
      const success = await login(email, password);
      if (success) onClose();
    } else {
      const success = await register({ username, email, password, displayName });
      if (success) onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight="bold">
            {type === 'login' ? 'Welcome Back' : 'Join SocialCommerce'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pb: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {type === 'register' && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '16px',
              outline: 'none',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: '24px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '16px',
              outline: 'none',
            }}
          />
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b5b95 100%)',
              },
            }}
          >
            {loading ? 'Loading...' : type === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
          
          <Button
            variant="text"
            fullWidth
            onClick={onToggleType}
            sx={{ textDecoration: 'underline' }}
          >
            {type === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { state: cartState, addItem: addToCart, toggleCart } = useCart();
  const [currentView, setCurrentView] = useState('feed');
  const [posts, setPosts] = useState(mockSocialPosts);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showProductPage, setShowProductPage] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);

  // Handle navigation
  const handleNavigate = (path: string) => {
    if (path === '/people' || path === 'people') {
      setShowUserSearch(true);
      setCurrentView('people');
    } else {
      setCurrentView(path.replace('/', '') || 'feed');
    }
  };

  // Handle product page navigation
  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setShowProductPage(true);
  };

  // Handle search
  const handleSearch = (query: string) => {
    // Implement search functionality
    console.log('Searching for:', query);
  };

  // Handle product recommendations
  const handleProductRecommend = (category: string) => {
    // Implement product recommendations
    console.log('Recommending products for:', category);
    setCurrentView('explore');
  };

  // Handle post interactions
  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setCommentsOpen(true);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleShareCart = (chatId: string) => {
    setSnackbarMessage('Cart shared successfully!');
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setSnackbarMessage(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (product: any) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isInWishlist) {
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
      setSnackbarMessage(`${product.name} removed from wishlist`);
    } else {
      setWishlistItems(prev => [...prev, product]);
      setSnackbarMessage(`${product.name} added to wishlist!`);
    }
  };

  const handlePostCreated = (newPost: any) => {
    setPosts(prev => [newPost, ...prev]);
    setSnackbarMessage('Post created successfully!');
    setCurrentView('feed');
  };

  // Landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: 'center',
              maxWidth: 500,
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <Typography variant="h2" fontWeight="bold" sx={{ mb: 2 }}>
              SocialCommerce
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              The future of social shopping is here. Discover, share, and shop with AI-powered recommendations.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => {
                  setAuthModalType('login');
                  setAuthModalOpen(true);
                }}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<RegisterIcon />}
                onClick={() => {
                  setAuthModalType('register');
                  setAuthModalOpen(true);
                }}
                sx={{ px: 4, py: 1.5 }}
              >
                Create Account
              </Button>
            </Box>
          </Paper>
        </motion.div>

        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          type={authModalType}
          onToggleType={() => setAuthModalType(type => type === 'login' ? 'register' : 'login')}
        />
      </Box>
    );
  }

  // Main authenticated app
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation
        currentUser={user!}
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery=""
        onSearchChange={handleSearch}
        cartItemsCount={cartState.totalItems}
        wishlistCount={wishlistItems.length}
        notificationsCount={0}
        onCartOpen={toggleCart}
        onNotificationsOpen={() => setSnackbarMessage('Notifications opened!')}
        onProductClick={(product) => handleProductClick(product.id)}
      />

      <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
        <AnimatePresence mode="wait">
          {/* Feed View */}
          {currentView === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PostCard
                      post={post}
                      currentUser={user!}
                      isLiked={post.isLiked}
                      isBookmarked={post.isBookmarked}
                      isFollowing={false}
                      onLike={() => handleLikePost(post.id)}
                      onBookmark={() => {}}
                      onFollow={() => {}}
                      onAddToCart={handleAddToCart}
                      onProductClick={() => post.product && handleProductClick(post.product.id)}
                      onWishlist={handleToggleWishlist}
                      onToggleComments={() => handlePostClick(post)}
                      wishlistItems={wishlistItems}
                      cartItems={cartState.items}
                      aiInsightsEnabled={true}
                    />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}

          {/* Explore View */}
          {currentView === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ExplorePage
                onProductClick={(product) => handleProductClick(product.id)}
                onWishlist={handleToggleWishlist}
                onCompare={() => {}}
                onShare={() => {}}
                wishlistItems={wishlistItems}
                compareItems={[]}
              />
            </motion.div>
          )}

          {/* Video Promotions View */}
          {currentView === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VideoPromotion
                onProductClick={(product) => handleProductClick(product.id)}
                onCreateVideo={() => {}}
              />
            </motion.div>
          )}

          {/* Messages View */}
          {currentView === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DirectMessages
                currentUser={{
                  ...user!,
                  isOnline: true,
                  lastSeen: new Date(),
                  isVerified: user!.isVerified
                } as any}
                onShareCart={handleShareCart}
                onProductShare={() => {}}
              />
            </motion.div>
          )}

          {/* Profile View */}
          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EnhancedProfile
                isOwnProfile={true}
                onProductClick={(product) => handleProductClick(product.id)}
                onPostClick={handlePostClick}
                onFollowToggle={() => {}}
              />
            </motion.div>
          )}

          {/* Create View */}
          {currentView === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CreatePost onPostCreated={handlePostCreated} />
            </motion.div>
          )}

          {/* Settings View */}
          {currentView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Settings onClose={() => setCurrentView('feed')} />
            </motion.div>
          )}

          {/* Trending View */}
          {currentView === 'trending' && (
            <motion.div
              key="trending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ExplorePage
                onProductClick={(product) => handleProductClick(product.id)}
                onWishlist={handleToggleWishlist}
                onCompare={() => {}}
                onShare={() => {}}
                wishlistItems={wishlistItems}
                compareItems={[]}
              />
            </motion.div>
          )}

          {/* User Search View */}
          {currentView === 'people' && (
            <motion.div
              key="people"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UserSearch onClose={() => setCurrentView('feed')} />
            </motion.div>
          )}

          {/* Analytics View */}
          {currentView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyticsDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* AI Guide Assistant */}
      <AIGuide
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        onProductRecommend={handleProductRecommend}
      />

      {/* Comments Drawer */}
      <CommentsDrawer
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        postId={selectedPost?.id || ''}
        postAuthor={selectedPost?.user}
        currentUser={user!}
        comments={[]}
        onAddComment={async () => {}}
        onLikeComment={() => {}}
        onDislikeComment={() => {}}
        onDeleteComment={() => {}}
        onEditComment={() => {}}
        onReportComment={() => {}}
        loading={false}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarMessage('')} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Product Page Dialog */}
      <Dialog
        open={showProductPage}
        onClose={() => setShowProductPage(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '95vh',
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {selectedProductId && (
          <ProductPage
            productId={selectedProductId}
            onClose={() => setShowProductPage(false)}
          />
        )}
      </Dialog>
    </Box>
  );
};

// Main App Component with Providers
const ModernApp: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SocialProvider>
          <CartProvider>
            <Router>
              <AppContent />
            </Router>
          </CartProvider>
        </SocialProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default ModernApp;