import React, { useState, Fragment } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { GUEST_NAV_ITEMS, USER_NAV_ITEMS, ADMIN_NAV_ITEMS, MOCK_ADMIN_NOTIFICATIONS, ROUTES } from '../../constants';
import { NavItem, AdminNotification } from '../../types';
import Button from '../shared/Button';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { BellIcon as BellOutlineIcon } from '@heroicons/react/24/outline'; // Outline for default state
import { LucideIcon } from 'lucide-react'; 
import { useAccentColor } from '../../hooks/useAccentColor'; 
import { Menu, Transition } from '@headlessui/react'; // For dropdown

const AdminNotificationsDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>(MOCK_ADMIN_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative" aria-label="Notifications">
        {unreadCount > 0 ? <BellSolidIcon className="h-6 w-6 text-primary-500" /> : <BellOutlineIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800 text-xs text-white flex items-center justify-center leading-none">
            {/* {unreadCount > 9 ? '9+' : unreadCount}  Displaying dot instead of count for cleaner look */}
          </span>
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none max-h-96 overflow-y-auto">
          <div className="px-1 py-1 ">
            <div className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">Notifications ({unreadCount} unread)</div>
          </div>
          <div className="px-1 py-1">
            {notifications.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No new notifications.</div>
            ) : (
              notifications.map((notification) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <Link
                      to={notification.link || '#'}
                      onClick={() => markAsRead(notification.id)}
                      className={`${
                        active ? 'bg-primary-500/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-gray-100'
                      } group flex w-full items-start rounded-md px-3 py-3 text-sm ${!notification.read ? 'font-semibold' : 'font-normal'}`}
                    >
                      {notification.icon && <notification.icon className={`mr-3 h-5 w-5 ${!notification.read ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`} aria-hidden="true" />}
                      <div className="flex-1">
                        <p className={`truncate ${!notification.read ? 'text-gray-800 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(notification.timestamp).toLocaleString()}</p>
                      </div>
                       {!notification.read && <span className="ml-2 mt-0.5 h-2 w-2 rounded-full bg-primary-500"></span>}
                    </Link>
                  )}
                </Menu.Item>
              ))
            )}
          </div>
           <div className="px-1 py-1">
             <Menu.Item>
                {({ active }) => (
                    <button
                    className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                    } group flex w-full items-center justify-center rounded-md px-3 py-2 text-sm`}
                    // onClick={() => alert("View all notifications - Not implemented")} // Placeholder
                    >
                    View All (Simulated)
                    </button>
                )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};


const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { accentColor } = useAccentColor(); 
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  let navItems: NavItem[];
  if (isAdmin) {
    navItems = ADMIN_NAV_ITEMS;
  } else if (isAuthenticated) {
    navItems = USER_NAV_ITEMS;
  } else {
    navItems = GUEST_NAV_ITEMS;
  }

  const commonNavClasses = "flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 group";
  const activeNavClasses = `bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300 font-semibold shadow-inner ring-1 ring-primary-500/50`;


  const renderNavLinks = (items: NavItem[]) => items.map((item) => {
    const IconComponent = item.icon as LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
    return (
      <NavLink
        key={item.path}
        to={item.path}
        title={item.title || item.label}
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) => `${commonNavClasses} ${isActive ? activeNavClasses : ''}`}
      >
        <IconComponent className={`h-5 w-5 mr-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-300 transition-colors duration-150 ${/*isActive ? 'text-primary-500' : ''*/''}`} />
        <span className="truncate">{item.label}</span>
      </NavLink>
    );
  });
  
  const LogoText: React.FC = () => (
    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400 group-hover:animate-logoPulseGlow transition-all duration-300">
      YouthTalentHub
    </span>
  );


  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <Link to="/" className="group">
          <LogoText />
        </Link>
        <div className="flex items-center">
          {isAdmin && <AdminNotificationsDropdown />}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
            aria-label={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <SunIcon className="h-6 w-6 text-yellow-400" /> : <MoonIcon className="h-6 w-6 text-gray-700" />}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" /> : <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-full bg-white dark:bg-gray-800 shadow-xl transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out pt-16 md:pt-0 flex flex-col`}
        aria-label="Main Navigation"
      >
        <div className="p-6">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center mb-6 group">
            <img src={`https://picsum.photos/seed/${accentColor.cssVariableSuffix || 'logo'}/40/40`} alt="Youth Talent Hub Logo" className="h-10 w-10 rounded-full mr-3 transition-all duration-500 ease-out group-hover:rotate-[360deg] group-hover:scale-110" />
            <LogoText />
          </Link>
          <div className="flex items-center justify-between mb-4">
             {isAdmin && <AdminNotificationsDropdown />}
             {/* Spacer if not admin or ensure theme toggle is positioned correctly */}
             {isAdmin && <div className="flex-grow"></div> } 
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${!isAdmin ? 'ml-auto' : ''}`}
              aria-label={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
          <nav className="space-y-1.5">
            {renderNavLinks(navItems)}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-gray-200 dark:border-gray-700">
          
          {isAuthenticated && (
            <Button
              onClick={handleLogout}
              variant="secondary"
              className="w-full"
              leftIcon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
              title={`Logout ${user?.name ? user.name.split(' ')[0] : ''}`}
            >
              Logout {user?.name ? `(${user.name.split(' ')[0]})` : ''}
            </Button>
          )}
        </div>
      </aside>
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;