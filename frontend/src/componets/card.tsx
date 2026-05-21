interface CardProps {
    title?:string,
    text: string
}

export default function Card({title, text}:CardProps) {
    return (
        <div className="m-6 p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="text-gray-700">{text}</p>
        </div>
    )
}