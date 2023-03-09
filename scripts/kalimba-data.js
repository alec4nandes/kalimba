const noteLengths = ["sixteenth", "eighth", "quarter", "half", "whole"],
    tines = new Map([
        ["back left", ["5F", "5Db", "4Bb", "4Eb", "3Ab"]],
        // asterisk = tine with dot. what does dot mean?
        [
            "front",
            [
                "5F#*",
                "5D*",
                "4B*",
                "4G",
                "4E*",
                "4C",
                "3A*",
                "3G*",
                "3B*",
                "4D*",
                "4F#*",
                "4A*",
                "5C",
                "5E*",
                "5G",
            ],
        ],
        ["back right", ["3Gb", "3Bb", "4Db", "4F", "4Ab", "5Eb"]],
    ]),
    allNotes = [...tines.values()].flat(Infinity);

export { allNotes, noteLengths };
