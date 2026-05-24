from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


def _load_markov_generator():
    module_path = (
        Path(__file__).resolve().parent.parent / "chord make" / "markov" / "data.py"
    )
    spec = spec_from_file_location("markov_data", module_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Unable to load markov generator from {module_path}")

    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.make_markov_sentences


@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok"})


@api_view(["POST"])
def generate_progression(request):
    raw_length = request.data.get("length", 8)

    try:
        length = int(raw_length)
    except (TypeError, ValueError):
        return Response(
            {"detail": "Length must be a whole number."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if length < 1 or length > 16:
        return Response(
            {"detail": "Length must be between 1 and 16."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        make_markov_sentences = _load_markov_generator()
        progression = make_markov_sentences(length)
    except Exception as exc:
        return Response(
            {"detail": f"Unable to generate progression: {exc}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    chords = [chord for chord in progression.split("-") if chord]

    return Response(
        {
            "length": length,
            "progression": progression,
            "chords": chords,
        }
    )
