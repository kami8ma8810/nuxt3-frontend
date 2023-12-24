<script setup lang="ts">
import type {City} from "@/interfaces";
// OpenWeatherAPI のインポート
const runtimeConfig = useRuntimeConfig(); // env から値を取得するための関数

//ルートオブジェクトを用意、
const route = useRoute();
//都市情報リストをステートから取得。
const cityList = useState<Map<number, City>>("cityList");
//ルートパラメータをもとに該当都市データを取得。
const selectedCity = computed(
	(): City => {
		const idNo = Number(route.params.id);
		return cityList.value.get(idNo) as City;
	}
);

// useAsyncData を使って非同期データを取得。
// 第一引数には、取得したいデータのURLを指定。
// 第二引数には、取得処理を記述。
// 第三引数には、オプションを指定。
const asyncData = await useAsyncData(
	`/WeatherInfo/${route.params.id}`,
	(): Promise<any> => {
		const weatherInfoUrl = "https://api.openweathermap.org/data/2.5/weather";
		const params:{
			lang: string;
			q: string;
			appid: string;
		} =
		{
			lang: "ja",
			q: selectedCity.value.q,
			//APIキーのクエリパラメータ。ここに各自の文字列を記述する!!
			// appid: "57a95fb61840b04b3829fdbbc9c307b1"
			appid: runtimeConfig.openWeatherApiKey as string
		}
		const queryParams = new URLSearchParams(params);
		const urlFull = `${weatherInfoUrl}?${queryParams}`;
		const response = $fetch(urlFull);
		return response;
	},
	{
		// pick: ["weather"],
		// pick オプションを使うと、取得したデータのうち、必要なものだけを取得できる。
		transform: (data: any): string => {
			const weatherArray = data.weather;
			const weather = weatherArray[0];
			return weather.description;
		}
	}
);

//天気情報のテンプレート変数を用意。
// const weatherDescription = ref("");

//アクセス先URLの基本部分の変数を用意。
// const weatherInfoUrl = "https://api.openweathermap.org/data/2.5/weather";
//クエリパラメータの元データとなるオブジェクトリテラルを用意。
// const params:{
// 	lang: string;
// 	q: string;
// 	appid: string;
// } =
// {
// 	//言語設定のクエリパラメータ
// 	lang: "ja",
// 	//都市を表すクエリパラメータ。
// 	q: selectedCity.value.q,
// 	//APIキーのクエリパラメータ。ここに各自の文字列を記述する!!
// 	appid: "57a95fb61840b04b3829fdbbc9c307b1"
// 	// appid: runtimeConfig.openWeatherApiKey as string
// }
// //クエリパラメータを生成。
// const queryParams = new URLSearchParams(params);
// //実際にアクセスするURLを生成。
// const urlFull = `${weatherInfoUrl}?${queryParams}`;
// //URLに非同期でアクセスしてデータを取得。
// const response = await $fetch(urlFull) as any;
// //天気情報JSONから天気データを取得し、テンプレート変数に格納。
// const weatherArray = response.weather;
// const weather = weatherArray[0];
// weatherDescription.value = weather.description;
const weatherDescription = asyncData.data;
</script>

<template>
	<section>
		<h2>{{selectedCity.name}}の天気</h2>
		<p>{{weatherDescription}}</p>
	</section>
	<p>リストに<NuxtLink v-bind:to="{name: 'index'}">戻る</NuxtLink></p>
</template>
