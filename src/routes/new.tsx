import { onMount } from "solid-js"
import { generateKeyPair } from "~/utils/key"

export default function New() {
    onMount(() => {
        console.log(generateKeyPair())
    })
    
    return (
        <main></main>
    )
}