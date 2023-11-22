const noteLengths = [
        { name: "sixteenth", size: 1, timeSig: 16 },
        { name: "eighth", size: 2, timeSig: 8 },
        { name: "quarter", size: 4, timeSig: 4 },
        { name: "half", size: 8, timeSig: 2 },
        { name: "whole", size: 16, timeSig: 1 },
    ],
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
    allNotes = [...tines.values()].flat(Infinity),
    tiedNotes = {
        // 1: sixteenth note (1)
        1: [1],
        // 2: eighth note (2)
        2: [2],
        // 3: dotted eighth note (2+1)
        3: [3],
        // 4: quarter note
        4: [4],
        // 5: tied quarter and sixteenth note (4+1)
        5: [4, 1],
        // 6: dotted quarter note
        6: [6],
        // 7: twice dotted quarter note (4+2+1)
        7: [7],
        // 8: half note
        8: [8],
        // 9: tied half and sixteenth note (8+1)
        9: [8, 1],
        // 10: tied half and eighth note (8+2)
        10: [8, 2],
        // 11: tied half and dotted eighth note (8+3)
        11: [8, 3],
        // 12: dotted half note (8+4)
        12: [12],
        // 13: tied dotted half and 16th (12+1)
        13: [8, 4, 1],
        // 14: twice dotted half note (8+4+2)
        14: [14],
        // 15: three dotted half note (8+4+2+1)
        15: [15],
        // 16: whole note
        16: [16],
    };

export { allNotes, noteLengths, tiedNotes };
