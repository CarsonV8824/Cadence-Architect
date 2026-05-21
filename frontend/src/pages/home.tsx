import Card from "../componets/card"
import HomeContent from "./content/home.json"

export default function Home() {
    return (
        <div>
            <Card title={HomeContent.title} text={HomeContent.titleContent}></Card>
        </div>
    )
}