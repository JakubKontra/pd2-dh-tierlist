import { SHEET_URL } from "../data/fetchSheet";

export function About() {
  return (
    <div className="max-w-3xl mx-auto prose-invert">
      <h1 className="heading-gold text-3xl sm:text-4xl mb-4">About this tier list</h1>

      <section className="panel p-5 mb-4 space-y-3 text-stone-300">
        <p>
          This is an interactive companion to the{" "}
          <a
            href={SHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="text-d2-gold hover:underline"
          >
            PD2 Season 13 Build Tier List
          </a>{" "}
          maintained by <span className="text-d2-gold">Dark Humility</span>. The
          data is fetched live from the public Google Sheet, so this page always
          reflects the latest testing.
        </p>
      </section>

      <h2 className="heading-gold text-xl mt-6 mb-2">Methodology</h2>
      <div className="panel p-5 text-sm space-y-3 text-stone-300">
        <Term
          k="MPM"
          v="Monsters Per Minute — the raw kill rate measured on a T3 map run."
        />
        <Term
          k="Density"
          v="Monster density of the tested map, as %. PD2 rolls map density as an affix each time, so it varies between runs."
        />
        <Term
          k="Normalized MPM"
          v="(MPM × 200) / (Density + 100). Rescales every run to a 200%-density baseline so builds tested on different maps with different density rolls are directly comparable."
        />
        <Term
          k="Tier placement"
          v="The average normalized MPM across the build's top 3 T3 maps is compared against tier cutoffs derived from the whole dataset. Top half (B- → S+) uses one interval, bottom half (C+ → F-) uses another."
        />
        <Term
          k="Handicap (H Lvl N)"
          v="Manual tier adjustment Dark Humility applies when a build had fewer test runs or was impacted by nerfs in closed-beta patches. Lvl 1 = +⅓ tier up, Lvl 2 = +⅔ tier up, Lvl -1 = ⅓ tier down. Toggle 'Apply handicap' on the tier list to switch between raw data placement and final display placement."
        />
        <Term
          k="(f) Fortified map"
          v="The build was tested on a Fortified-affix map (optimal for many builds). Does not affect scoring, just context."
        />
        <Term
          k="RT'd Retested"
          v="Build was retested after the closed-beta patch notes were published. Untagged builds still reflect older test data."
        />
      </div>

      <h2 className="heading-gold text-xl mt-6 mb-2">Credit</h2>
      <div className="panel p-5 text-sm space-y-2 text-stone-300">
        <p>
          All testing, scoring, methodology and tier placement:{" "}
          <span className="text-d2-gold font-bold">Dark Humility</span>.
        </p>
        <p>
          This site is a fan-made viewer. It does not modify or reinterpret the
          data — tier derivation follows the same formula used in the sheet. If
          you spot a discrepancy, please file an issue so the mapping can be
          corrected.
        </p>
        <p>
          Site built by{" "}
          <a
            href="https://jakubkontra.com"
            target="_blank"
            rel="noreferrer"
            className="text-d2-gold hover:underline"
          >
            Jakub Kontra
          </a>
          , PD2 player known as{" "}
          <a
            href="https://www.twitch.tv/thejimmycz"
            target="_blank"
            rel="noreferrer"
            className="text-d2-gold font-bold hover:underline"
          >
            thejimmycz
          </a>{" "}
          on Twitch.
        </p>
        <p>
          <a
            href="https://projectdiablo2.com"
            target="_blank"
            rel="noreferrer"
            className="text-d2-unique hover:underline"
          >
            projectdiablo2.com →
          </a>
        </p>
      </div>
    </div>
  );
}

function Term({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-d2-unique font-mono text-xs uppercase tracking-wider">
        {k}
      </div>
      <p className="mt-0.5">{v}</p>
    </div>
  );
}
