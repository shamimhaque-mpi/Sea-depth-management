import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './pages/Home.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/geographical-map',
        name: 'Geographical Map',
        component: () => import('./pages/GeographicalMap.vue')
    },
    {
        path: '/spacifical-visualization',
        name: 'Spacifical Visualization',
        component: () => import('./pages/SpacificalVisualization.vue')
    },
    {
        path: '/statistical-visualization',
        name: 'Statistical Visualization',
        component: () => import('./pages/StatisticalVisualization.vue')
    },
    {
        path: '/time-spacifical-visualization',
        name: 'Time Spacifical Visualization',
        component: () => import('./pages/TimeSpacificalVisualization.vue')
    },
    {
        path: '/time-statistical-visualization',
        name: 'Time Statistical Visualization',
        component: () => import('./pages/TimeStatisticalVisualization.vue')
    },






    //   REJECT FOR VALIDATION
    {
        path: '/design',
        name: 'Trajectory And Design',
        component: () => import('./pages/TrajectoryAndDesign.vue')
    },
    {
        path: '/trajectory-map',
        name: 'Trajectory Map',
        component: () => import('./pages/TrajectoryMap.vue')
    },
    {
        path: '/trajectory-design',
        name: 'Trajectory Design',
        component: () => import('./pages/TrajectoryAndDesign.vue')
    },
    {
        path: '/hole-section',
        name: 'Hole Section',
        component: () => import('./pages/HoleSection.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
