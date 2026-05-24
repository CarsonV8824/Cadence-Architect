import { useState, type FormEvent } from "react"
import ChordPlayer from "../componets/chord-player"
import GenerateContent from "./content/generate.json"

const LENGTH_OPTIONS = [4, 6, 8, 12, 16]
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000"

interface GenerateResponse {
    length: number
    progression: string
    chords: string[]
}

export default function Generate() {
    const [length, setLength] = useState<number>(8)
    const [progression, setProgression] = useState<string[]>([])
    const [progressionText, setProgressionText] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch(`${API_BASE_URL}/api/generate/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ length }),
            })

            const data: GenerateResponse | { detail?: string } = await response.json()

            if (!response.ok) {
                throw new Error(("detail" in data && data.detail) || "Generation failed.")
            }

            if (!("chords" in data) || !Array.isArray(data.chords)) {
                throw new Error("The server returned an unexpected response.")
            }

            setProgression(data.chords)
            setProgressionText(data.progression)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Generation failed."
            setError(message)
            setProgression([])
            setProgressionText("")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl flex-col gap-8 px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-200">Generator</p>
                <h1 className="mt-3 text-4xl font-bold text-white">{GenerateContent.title}</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
                    {GenerateContent.description}
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-gray-200/15 bg-indigo-950/80 p-6 shadow-xl"
                >
                    <label htmlFor="progression-length" className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-200">
                        Progression length
                    </label>
                    <select
                        id="progression-length"
                        value={length}
                        onChange={(event) => setLength(Number(event.target.value))}
                        className="mt-3 w-full rounded-2xl border border-indigo-700 bg-indigo-900 px-4 py-3 text-lg text-white outline-none transition focus:border-gray-200"
                    >
                        {LENGTH_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option} chords
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gray-300 px-4 py-3 text-base font-semibold text-gray-900 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {isLoading ? (
                            <>
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-700 border-t-transparent" />
                                <span>Generating</span>
                                <span className="flex items-center gap-1" aria-hidden="true">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-900 [animation-delay:0ms]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-900 [animation-delay:150ms]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-900 [animation-delay:300ms]" />
                                </span>
                            </>
                        ) : (
                            "Generate progression"
                        )}
                    </button>

                    <p className="mt-4 text-sm leading-6 text-slate-300">
                        The frontend sends your selected length in a POST request, and the Django server uses it when calling the Markov generator.
                    </p>
                </form>

                <div className="rounded-3xl border border-gray-200/15 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-200">Latest result</p>

                    {error ? (
                        <div className="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-100">
                            {error}
                        </div>
                    ) : null}

                    {progression.length > 0 ? (
                        <div className="mt-6">
                            <div className="flex flex-wrap gap-3">
                                {progression.map((chord, index) => (
                                    <div
                                        key={`${chord}-${index}`}
                                        className="rounded-2xl border border-gray-300/20 bg-white/15 px-4 py-3 text-xl font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-white/20"
                                    >
                                        {chord}
                                    </div>
                                ))}
                            </div>
                            <p className="mt-6 text-sm uppercase tracking-[0.25em] text-slate-300">API response</p>
                            <p className="mt-2 rounded-2xl bg-black/20 px-4 py-3 font-mono text-sm text-gray-100">
                                {progressionText}
                            </p>
                            <ChordPlayer progression={progression} />
                        </div>
                    ) : (
                        <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-slate-300">
                            Pick a progression length and generate a result to see the returned chords here.
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
