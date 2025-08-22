# Development Access Guide
*For bypassing authentication during development*

## 🚀 Easy Development Access

### Method 1: Dev Bypass Button (Recommended)
1. **Go to Sign In page**: Navigate to `/signin` or the login page
2. **Click "Dev Bypass"**: Green button that says "🚀 Dev Bypass - Skip Authentication" 
3. **Access Dashboard**: Automatically logs you in as super admin and redirects to dashboard

### Method 2: Direct API Call
```bash
# Test the dev bypass endpoint directly
curl -X POST http://localhost:5000/api/auth/dev-bypass
```

### Method 3: Quick Access URL
- Visit: `http://localhost:5000/dev`
- Automatically redirects with dev token

## 👨‍💻 Dev User Details

**When using dev bypass, you'll be logged in as:**
- **Email**: dev@smartcrm.local
- **Name**: Development User  
- **Role**: super_admin
- **Access**: Full application access
- **Session**: 24-hour validity

## 🔒 Security Notes

- **Development Only**: Only works when `NODE_ENV=development`
- **Production Safe**: Completely disabled in production environments
- **No Real Data**: Uses mock dev user - doesn't affect real user accounts

## 📱 Usage

Perfect for:
- Testing features without authentication
- Quick development access
- UI/UX testing
- Remote apps testing
- API development

The dev bypass gives you immediate access to the full SmartCRM dashboard with super admin privileges!