<template>
	<div :class="containerClass" @click="onWrapperClick">
        <AppTopBar @menu-toggle="onMenuToggle" />
        <div class="layout-sidebar" @click="onSidebarClick">
            <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>
        </div>

		<AppConfig :layoutMode="layoutMode" :layoutColorMode="layoutColorMode" @layout-change="onLayoutChange" @layout-color-change="onLayoutColorChange" />
        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition>
	</div>
</template>

<script>
import AppTopBar from './AppTopbar.vue';
import AppMenu from './AppMenu.vue';
import AppConfig from './AppConfig.vue';
// import AppFooter from './AppFooter.vue';

export default {
    data() {
        return {
            layoutMode: 'static',
            layoutColorMode: 'light',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            menu : [
                {
                    label: 'Home', 
                    icon: 'pi pi-fw pi-home', 
                    to: '/'
                },
                {
                    label: 'Drilling data visualization', 
                    icon: 'pi pi-fw pi-check-square', 
                    items:[
                        {
                            label: 'Well Overview', 
                            icon: 'pi pi-angle-right', 
                            to: '/geographical-map'
                        },
                        {
                            label: 'Depth based data', 
                            icon: 'pi pi-angle-right', 
                            items: [
                                {
                                    label: 'Statistical Visualization', 
                                    icon: 'pi pi-angle-right', 
                                    to: '/statistical-visualization'
                                },
                                {
                                    label: 'Spacific Visualization', 
                                    icon: 'pi pi-angle-right', 
                                    to: '/spacifical-visualization'
                                }
                            ],
                        },
                        {
                            label: 'Time based data', 
                            icon: 'pi pi-angle-right',
                            items: [
                                {
                                    label: 'Statistical Visualization', 
                                    icon: 'pi pi-angle-right', 
                                    to: '/time-statistical-visualization'
                                },
                                {
                                    label: 'Spacific Visualization', 
                                    icon: 'pi pi-angle-right', 
                                    to: '/time-spacifical-visualization'
                                }
                            ],
                        },
                        {
                            label: 'Trajectory based data 3D', 
                            icon: 'pi pi-angle-right',
                            to: '/trajectory-map'
                        }
                    ]
                },
                {
                    label: 'Well configuration', 
                    icon: 'pi pi-fw pi-bookmark',
                    items:[
                        {
                            label: 'Hole section', 
                            icon: 'pi pi-angle-right', 
                            to: '/hole-section'
                        },
                        {
                            label: 'Well path', 
                            icon: 'pi pi-angle-right', 
                        },
                        {
                            label: 'Drilling string', 
                            icon: 'pi pi-angle-right', 
                        },
                        {
                            label: 'Drilling fluids', 
                            icon: 'pi pi-angle-right', 
                        },
                        {
                            label: 'More to come', 
                            icon: 'pi pi-angle-right', 
                        }
                    ]
                },
                {
                    label: 'Drilling geology', 
                    icon: 'pi pi-fw pi-bookmark',
                    items:[
                        {
                            label: 'Formation', 
                            icon: 'pi pi-angle-right', 
                        },
                        {
                            label: 'Geopressure', 
                            icon: 'pi pi-angle-right', 
                        },
                        {
                            label: 'Geothermal', 
                            icon: 'pi pi-angle-right', 
                        }
                    ]
                },
            ]
        }
    },
    watch: {
        $route() {
            this.menuActive = false;
            this.$toast.removeAllGroups();
        }
    },
    methods: {
        onWrapperClick() {
            if (!this.menuClick) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle() {
            this.menuClick = true;

            if (this.isDesktop()) {
                if (this.layoutMode === 'overlay') {
					if(this.mobileMenuActive === true) {
						this.overlayMenuActive = true;
					}

                    this.overlayMenuActive = !this.overlayMenuActive;
					this.mobileMenuActive = false;
                }
                else if (this.layoutMode === 'static') {
                    this.staticMenuInactive = !this.staticMenuInactive;
                }
            }
            else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }
        },
		onLayoutChange(layoutMode) {
			this.layoutMode = layoutMode;
		},
		onLayoutColorChange(layoutColorMode) {
			this.layoutColorMode = layoutColorMode;
		},
        addClass(element, className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        },
        removeClass(element, className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },
        isDesktop() {
            return window.innerWidth >= 992;
        },
        isSidebarVisible() {
            if (this.isDesktop()) {
                if (this.layoutMode === 'static')
                    return !this.staticMenuInactive;
                else if (this.layoutMode === 'overlay')
                    return this.overlayMenuActive;
            }

            return true;
        }
    },
    computed: {
        containerClass() {
            return ['layout-wrapper', {
                'layout-overlay': this.layoutMode === 'overlay',
                'layout-static': this.layoutMode === 'static',
                'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
                'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
                'layout-mobile-sidebar-active': this.mobileMenuActive,
				'p-input-filled': this.$primevue.config.inputStyle === 'filled',
				'p-ripple-disabled': this.$primevue.config.ripple === false,
                'layout-theme-light': this.$appState.theme.startsWith('saga')
            }];
        },
        logo() {
            return (this.layoutColorMode === 'dark') ? "images/logo-white.svg" : "images/logo.svg";
        }
    },
    beforeUpdate() {
        if (this.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    },
    components: {
        'AppTopBar': AppTopBar,
        'AppMenu': AppMenu,
        'AppConfig': AppConfig,
        // 'AppFooter': AppFooter,
    }
}
</script>

<style lang="scss">
@import './App.scss';
.welcom{
    width: 100%;
    min-height: 76vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
