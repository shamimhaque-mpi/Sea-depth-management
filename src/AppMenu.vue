<template>
	<div class="layout-menu-container">
		<AppSubmenu :items="model" class="layout-menu" :root="false" @menuitem-click="onMenuItemClick" />
	</div>
</template>

<script>
import AppSubmenu from './AppSubmenu';

export default {
	props: {
		model: Array
	},
    methods: {
        onMenuItemClick(event) {
            this.$emit('menuitem-click', event);
        }
    },
	computed: {
		darkTheme() {
			return this.$appState.theme.startsWith('saga');
		}
	},
	components: {
		'AppSubmenu': AppSubmenu
	}
}
</script>

<style scoped>

</style>