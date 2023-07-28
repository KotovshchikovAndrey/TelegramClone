import typing as tp

import json
import pathlib
import aiofiles

LOCALIZATION_PATH = pathlib.Path(__file__).parent.parent / "localization"
ALLOWED_LANGUAGES = tp.Literal["ru", "en"]


async def translate(word: str, language_code: ALLOWED_LANGUAGES = "ru") -> str | None:
    currect_localizaton_file = f"{LOCALIZATION_PATH}/{language_code}.json"
    async with aiofiles.open(currect_localizaton_file, "r", encoding="utf-8") as file:
        file_content = json.loads(await file.read())
        return dict(file_content).get(word)
