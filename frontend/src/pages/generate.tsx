import Card from "../componets/card"

export default function Generate(){
    return (
        <div>
            <div>
                <Card text={"works"}></Card>
            </div>
            <div className="grid grid-cols-2">
                <Card text={"works"}></Card>
                <Card text={"works"}></Card>
            </div>
        </div>
    )
}