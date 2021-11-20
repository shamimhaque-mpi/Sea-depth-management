<template>
	<div class="welcom bg-all">
		<h2 class="titel">Welcom To Drilling Database Web App.</h2>
		<div class="culd"></div>
		<div class="culd"></div>
		<div class="culd"></div>
		<div class="culd"></div>
		<div class="culd"></div>
	</div>
</template>

<script>

export default {
	data() {
		return {

		}
	},
	created() {
		//
	},
	mounted() {
		//
	},
	methods: {
		//
	}
}
</script>


<style scoped leng="scss">
	.bg-all {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.titel{
    color: #485056;
    font-size: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 1;
}
.culd{
    position: absolute;
    top: 100px;
    left: 100px;
    width: 10px;
    height: 10px;
    border: 1px solid #079e71;
    transform-origin: top left;
    transform: scale(0) rotate(0deg) translate(-50%,-50%);
    animation: culd 10s  ease-in forwards infinite;
}
.culd:nth-child(2n){
    border-color: #079e71;
}
.culd:nth-child(2){
    animation-delay: 2s;
    top: 90%;
    left: 10%;
}
.culd:nth-child(3){
    animation-delay: 4s;
    top: 10%;
    left: 50%;
}
.culd:nth-child(4){
    animation-delay: 6s;
    top: 50%;
    left: 60%;
}
.culd:nth-child(5){
    animation-delay: 8s;
    top: 40%;
    left: 90%;
}
@keyframes culd{
    from{
        transform: scale(0) rotate(0deg) translate(-50%,-50%);
        opacity: 1;
    }
    to{
        transform: scale(20) rotate(360deg) translate(-50%,-50%);
        opacity: 0;
    }
}
</style>