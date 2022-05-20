const title_parser = require("../utils/title_parser");

test("Splits properly on dash", () => {
  let result = title_parser("Attack on Titan - Episode 5");

  expect(result.title).toBe("Attack on Titan");
  expect(result.details).toBe("Episode 5");

  result = title_parser("Attack on Titan - Episode 5 - Season 3");

  expect(result.title).toBe("Attack on Titan");
  expect(result.details).toBe("Episode 5 - Season 3");
});

describe("Parses brackets and parenthesis", () => {
  test("Removes brackets", () => {
    const input =
      "[text here] [more text here] Shingeki no Kyojin - Episode 3 [more text]";
    const result = title_parser(input);

    expect(result.title).toBe("Shingeki no Kyojin");
    expect(result.details).toBe("Episode 3");
  });

  test("Removes parends", () => {
    const input =
      "(text here) (more text here) Shingeki no Kyojin - Episode 3 (more text)";
    const result = title_parser(input);

    expect(result.title).toBe("Shingeki no Kyojin");
    expect(result.details).toBe("Episode 3");
  });

  test("Removes both parenthesis and brackets", () => {
    const input =
      "(random text) [more random text] Shingeki no Kyojin (more text) - Episode 3 [ahhh]";
    const result = title_parser(input);

    expect(result.title).toBe("Shingeki no Kyojin");
    expect(result.details).toBe("Episode 3");
  });
});

describe("Parses episode", () => {
  describe("Typical episode formats", () => {
    test("Episode x", () => {
      let result = title_parser("Re:Zero - Episode 2");
      expect(result.title).toBe("Re:Zero");
      expect(result.episode).toBe("2");

      result = title_parser("Re:Zero Episode 2");
      expect(result.title).toBe("Re:Zero");
      expect(result.episode).toBe("2");
    });

    test("Epx", () => {
      let result = title_parser("Re:Zero - Ep3");
      expect(result.title).toBe("Re:Zero");
      expect(result.episode).toBe("3");

      result = title_parser("Re:Zero Ep3");
      expect(result.title).toBe("Re:Zero");
      expect(result.episode).toBe("3");
    });

    test("Ex", () => {
      let result = title_parser("Re:Zero - E3");
      expect(result.title).toBe("Re:Zero");
      expect(result.episode).toBe("3");

      result = title_parser("Re:Zero E3");
      expect(result.title).toBe("Re:Zero");
      expect(result.episode).toBe("3");
    });
  });
  describe("Unusual episode formats", () => {
    test("[season]x[episode]", () => {
      let result = title_parser("Steins;gate - 1x3");
      expect(result.title).toBe("Steins;gate");
      expect(result.episode).toBe("3");

      result = title_parser("Steins;gate 1x3");
      expect(result.title).toBe("Steins;gate");
      expect(result.episode).toBe("3");
    });

    test("[episode]v[season]", () => {
      let result = title_parser("Attack on Titan 3v1");
      expect(result.title).toBe("Attack on Titan");
      expect(result.episode).toBe("3");

      result = title_parser("Attack on Titan 3v1");
      expect(result.title).toBe("Attack on Titan");
      expect(result.episode).toBe("3");
    });
  });
});

describe("Fixes delimiting", () => {
  test("Underscore delimiters", () => {
    let result = title_parser(
      "[CBM]_Code_Geass_-_02_-_The_White_Knight_Awakens_[HEVC_1080p_10bit]_[6DB821B1]"
    );

    expect(result.title).toBe("Code Geass");
    expect(result.episode).toBe("02");
  });

  test("Period delimiters", () => {
    let result = title_parser(
      "[CBM].Code.Geass.-.02.-.The.White.Knight.Awakens.[HEVC.1080p.10bit].[6DB821B1]"
    );

    expect(result.title).toBe("Code Geass");
    expect(result.episode).toBe("02");
  });
});

describe("Edge Cases", () => {
  test("Number in title", () => {
    let result = title_parser("Steins Gate 0 1x3");

    expect(result.title).toBe("Steins Gate 0");
    expect(result.episode).toBe("3");
  });

  test("Number in title", () => {
    let result = title_parser(
      "Jojo's Bizarre Adventure E13 - Random Text Here"
    );

    expect(result.title).toBe("Jojo's Bizarre Adventure");
    expect(result.episode).toBe("13");
  });
});
