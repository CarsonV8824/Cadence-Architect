import { useEffect, useRef, useState } from "react"
import * as Tone from "tone"

interface ChordPlayerProps {
    progression: string[]
}

interface ChordEvent {
    time: string
    index: number
    notes: string[]
}

const NOTE_TO_SEMITONE: Record<string, number> = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
}

const SEMITONE_TO_NOTE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

function clampMidi(note: number) {
    return Math.max(48, Math.min(84, note))
}

function midiToNoteName(note: number) {
    const midi = clampMidi(note)
    const pitchClass = midi % 12
    const octave = Math.floor(midi / 12) - 1
    return `${SEMITONE_TO_NOTE[pitchClass]}${octave}`
}

function getIntervals(symbol: string) {
    const lowerSymbol = symbol.toLowerCase()

    if (lowerSymbol.includes("dim")) {
        return [0, 3, 6]
    }

    if (lowerSymbol.includes("aug") || lowerSymbol.includes("+")) {
        return [0, 4, 8]
    }

    if (lowerSymbol.includes("sus2")) {
        return [0, 2, 7]
    }

    if (lowerSymbol.includes("sus4") || lowerSymbol.includes("sus")) {
        return [0, 5, 7]
    }

    if (lowerSymbol.startsWith("m") && !lowerSymbol.startsWith("maj")) {
        return [0, 3, 7]
    }

    return [0, 4, 7]
}

function addColorTones(intervals: number[], symbol: string) {
    const lowerSymbol = symbol.toLowerCase()
    const output = [...intervals]

    if (lowerSymbol.includes("maj7")) {
        output.push(11)
    } else if (lowerSymbol.includes("7")) {
        output.push(10)
    } else if (lowerSymbol.includes("6")) {
        output.push(9)
    }

    return output
}

function chordToNotes(chord: string) {
    const cleanedChord = chord.trim().split("/")[0]
    const match = cleanedChord.match(/^([A-G])([b#]?)(.*)$/)

    if (!match) {
        return ["C4", "E4", "G4"]
    }

    const [, letter, accidental, quality] = match
    const root = `${letter}${accidental}`
    const rootSemitone = NOTE_TO_SEMITONE[root]

    if (rootSemitone === undefined) {
        return ["C4", "E4", "G4"]
    }

    const baseMidi = 60 + rootSemitone
    const intervals = addColorTones(getIntervals(quality), quality)

    return intervals.map((interval) => midiToNoteName(baseMidi + interval))
}

export default function ChordPlayer({ progression }: ChordPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentChordIndex, setCurrentChordIndex] = useState<number | null>(null)
    const synthRef = useRef<Tone.PolySynth | null>(null)
    const partRef = useRef<Tone.Part<ChordEvent> | null>(null)
    const completionEventRef = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (completionEventRef.current !== null) {
                Tone.Transport.clear(completionEventRef.current)
            }

            partRef.current?.dispose()
            synthRef.current?.dispose()
            Tone.Transport.stop()
            Tone.Transport.cancel(0)
        }
    }, [])

    useEffect(() => {
        setIsPlaying(false)
        setCurrentChordIndex(null)

        if (completionEventRef.current !== null) {
            Tone.Transport.clear(completionEventRef.current)
            completionEventRef.current = null
        }

        partRef.current?.dispose()
        partRef.current = null
        Tone.Transport.stop()
        Tone.Transport.cancel(0)
    }, [progression])

    async function handlePlay() {
        if (progression.length === 0) {
            return
        }

        await Tone.start()

        if (!synthRef.current) {
            synthRef.current = new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: "triangle",
                },
                envelope: {
                    attack: 0.02,
                    decay: 0.2,
                    sustain: 0.45,
                    release: 1,
                },
            }).toDestination()
        }

        if (completionEventRef.current !== null) {
            Tone.Transport.clear(completionEventRef.current)
            completionEventRef.current = null
        }

        partRef.current?.dispose()
        Tone.Transport.stop()
        Tone.Transport.cancel(0)
        Tone.Transport.position = 0
        Tone.Transport.bpm.value = 72

        const events: ChordEvent[] = progression.map((chord, index) => ({
            time: `${index}m`,
            index,
            notes: chordToNotes(chord),
        }))

        const part = new Tone.Part<ChordEvent>((time, value: ChordEvent) => {
            synthRef.current?.triggerAttackRelease(value.notes, "1m", time)
            setCurrentChordIndex(value.index)
        }, events).start(0)

        part.loop = false
        partRef.current = part

        completionEventRef.current = Tone.Transport.scheduleOnce(() => {
            setIsPlaying(false)
            setCurrentChordIndex(null)
        }, `${progression.length}m`)

        setIsPlaying(true)
        Tone.Transport.start("+0.05")
    }

    function handleStop() {
        if (completionEventRef.current !== null) {
            Tone.Transport.clear(completionEventRef.current)
            completionEventRef.current = null
        }

        partRef.current?.dispose()
        partRef.current = null
        Tone.Transport.stop()
        Tone.Transport.cancel(0)
        synthRef.current?.releaseAll()
        setIsPlaying(false)
        setCurrentChordIndex(null)
    }

    return (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-gray-300">Listen back</p>
                    <p className="mt-2 text-sm text-slate-300">
                        Hear the generated progression with a simple Tone.js synth.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handlePlay}
                        disabled={progression.length === 0 || isPlaying}
                        className="rounded-xl bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-gray-500"
                    >
                        {isPlaying ? "Playing..." : "Play progression"}
                    </button>
                    <button
                        type="button"
                        onClick={handleStop}
                        disabled={!isPlaying}
                        className="rounded-xl border border-gray-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-gray-400"
                    >
                        Stop
                    </button>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                {progression.map((chord, index) => {
                    const isActive = currentChordIndex === index

                    return (
                        <div
                            key={`${chord}-player-${index}`}
                            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                                isActive
                                    ? "border-white bg-white text-indigo-950 shadow-lg shadow-white/20"
                                    : "border-gray-300/20 bg-white/5 text-gray-200"
                            }`}
                        >
                            {chord}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
