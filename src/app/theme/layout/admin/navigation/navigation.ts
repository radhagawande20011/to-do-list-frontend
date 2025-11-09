export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: '',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      // {
      //   id: 'default',
      //   title: 'Dashboard',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: '/default',
      //   icon: 'ti ti-dashboard',
      //   breadcrumbs: false
      // },
      {
        id: 'tasks',
        title: 'Tasks',
        type: 'item',
        classes: 'nav-item',
        url: '/tasks',
 icon: 'ti ti-task',
        breadcrumbs: true
      }
    ]
  },
];


