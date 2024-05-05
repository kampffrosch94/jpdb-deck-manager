import { loadCachedDeck, saveDeckToCache } from "../state/db";

export { jpdbRequest, fetchDeckVocab, lookupVocab, fetchDecks, merge_vocab, isKnownWord, learnAheadCoverage };
declare global {
    interface Deck {
        name: string;
        id: number;
        known_coverage: number;
        learning_coverage: number;
        is_built_in: boolean;
        word_count: number;
        vocab_count: number;
    }

    interface Vocab {
        vid: number;
        sid: number;
        occurences: number;
    }

    // lifted from the breader, :ikneel:
    type CardState = string[] &
        (
            | [
                | "new"
                | "learning"
                | "known"
                | "never-forget"
                | "due"
                | "failed"
                | "suspended"
                | "blacklisted"
            ]
            | [
                "redundant",
                (
                    | "learning"
                    | "known"
                    | "never-forget"
                    | "due"
                    | "failed"
                    | "suspended"
                    | "locked"
                )
            ]
            | ["locked", "new" | "due" | "failed"]
            | ["redundant", "locked"] // Weird outlier, might either be due or failed
            | ["not-in-deck"]
        );

    interface VocabWithStateFrequency extends Vocab {
        state: CardState;
        frequency: number;
    }

    interface DeckWithVocab extends Deck {
        vocabs: Vocab[];
    }

    interface DeckWithVocabState extends Deck {
        vocabs: VocabWithStateFrequency[];
    }
}




async function jpdbRequest(url: string, body: object, token: string): Promise<Response> {
    let headers = new Headers();
    headers.set("Authorization", "Bearer " + token);
    headers.set("Content-Type", "application/json");
    return await fetch("https://jpdb.io/api/v1/" + url, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(body),
    });
}


async function fetchDeckVocab(token: string, deck: Deck): Promise<DeckWithVocab> {
    const json = await (
        await jpdbRequest(
            "deck/list-vocabulary",
            {
                id: deck.id,
                fetch_occurences: true,
            },
            token,
        )
    ).json();
    let vocabs = [];
    for (let i = 0; i < json.vocabulary.length; i++) {
        let vocab: Vocab = {
            vid: json.vocabulary[i][0],
            sid: json.vocabulary[i][1],
            occurences: json.occurences[i],
        };
        vocabs.push(vocab);
    }
    return { vocabs: vocabs, ...deck };
}

async function lookupVocab(token: string, vocabs: Vocab[]): Promise<VocabWithStateFrequency[]> {
    const ids = vocabs.map((it) => [it.vid, it.sid]);
    const json = await (
        await jpdbRequest(
            "lookup-vocabulary",
            {
                list: ids,
                fields: ["card_state", "frequency_rank"],
            },
            token,
        )
    ).json();
    let r = [];
    for (let i = 0; i < json.vocabulary_info.length; i++) {
        r.push({
            state: json.vocabulary_info[i][0],
            frequency: json.vocabulary_info[i][1],
            ...vocabs[i],
        });
    }
    return r;
}



async function fetchDecks(token: string): Promise<Deck[]> {
    let fields = {
        fields: [
            "name",
            "vocabulary_known_coverage",
            "vocabulary_in_progress_coverage",
            "is_built_in",
            "id",
            "word_count",
            "vocabulary_count",
        ],
    };
    let json = await (
        await jpdbRequest("list-user-decks", fields, token)
    ).json();
    //console.log(json);
    return json.decks.map(
        (it: [string, number, number, boolean, number, number, number]) => {
            let [
                name,
                known_coverage,
                learning_coverage,
                is_built_in,
                id,
                word_count,
                vocab_count,
            ] = it;
            return {
                name: name,
                id: id,
                known_coverage: known_coverage ?? 0,
                learning_coverage: learning_coverage ?? 0,
                is_built_in: is_built_in,
                word_count: word_count,
                vocab_count: vocab_count,
            };
        },
    );
}



function merge_vocab(vocabss: Vocab[][], min_decks: number): Vocab[] {
    interface VocabWithDeckCount extends Vocab {
        decks: number;
    }
    const merged_map = new Map();
    for (const vocabs of vocabss) {
        for (const vocab of vocabs) {
            const key = `${vocab.vid},${vocab.sid}`;
            const el = merged_map.get(key);
            if (el != null) {
                el.occurences += vocab.occurences;
                el.decks += 1;
            } else {
                merged_map.set(key, { decks: 1, ...vocab });
            }
        }
    }
    if (min_decks > 1) {
        const merged: VocabWithDeckCount[] = [];
        for (const v of merged_map.values()) {
            if (v.decks >= min_decks) {
                merged.push(v);
            }
        }
        return merged;
    } else {
        return [...merged_map.values()]
    }
}


function isKnownWord(v: VocabWithStateFrequency): boolean {
    return (
        ["known", "never-forget", "due", "failed", "learning"].includes(
            v.state[0],
        ) ||
        // cards that are both locked and failed don't count as known, while not locked and failed cards do
        // (for learning coverage)
        (v.state[0] === "locked" && v.state[1] === "due") ||
        (v.state[0] === "redundant" && v.state[1] !== "suspended") ||
        (v.state[0] === "redundant" && v.state[1] !== "locked")
    );
}

function computeCoverage(vocabs: VocabWithStateFrequency[]): number {
    let considered = vocabs.filter((v) => "blacklisted" != v.state[0]);
    let kinda_known = considered
        .filter(isKnownWord)
        .reduce((acc, v) => acc + v.occurences, 0);
    let all = considered.reduce((acc, v) => acc + v.occurences, 0);
    return 100.0 * (kinda_known / all);
}

function learnAheadCoverage(
    vocabs: VocabWithStateFrequency[],
    learnahead: number,
): number {
    const sorted = vocabs.sort((a, b) => b.occurences - a.occurences);
    let i = 0;
    let kinda_known = 0;
    let all = 0;
    while (i < sorted.length) {
        let v = sorted[i];
        i += 1;
        if (v.state[0] === "blacklisted") {
            continue;
        }
        all += v.occurences;
        if (isKnownWord(v)) {
            kinda_known += v.occurences;
        } else {
            if (learnahead > 0) {
                learnahead -= 1;
                kinda_known += v.occurences;
            }
        }
    }
    return 100.0 * (kinda_known / all);
}

export function grabXMostFrequentVocab(
    vocabs: VocabWithStateFrequency[],
    learnahead: number,
): VocabWithStateFrequency[] {
    const sorted = vocabs.sort((a, b) => b.occurences - a.occurences);
    let i = 0;
    const result = [];
    while ((i < sorted.length) && (learnahead > 0)) {
        let v = sorted[i];
        i += 1;
        if (v.state[0] === "blacklisted") {
            continue;
        }
        if (!isKnownWord(v)) {
            learnahead -= 1;
            result.push(v);
        }
    }
    return result;
}


export async function loadAllMediaDecksWithVocabState(token: string): Promise<DeckWithVocabState[]> {
    // grab all vocab from all relevant decks and combine it
    // ask api for state
    // sort the vocab state into decks
    let decks = [];

    let startTime = Date.now();
    console.log(`[${Date.now() - startTime}] Starting`);
    const fetched = await fetchDecks(token);
    const relevant_decks = fetched.filter(
        (it) => it.word_count > it.vocab_count * 3,
    );

    const vocabss: Vocab[][] = [];
    const v_decks = [];
    for (const deck of relevant_decks) {
        let vd = await loadCachedDeck(deck);
        if (vd === null) {
            vd = await fetchDeckVocab(token, deck);
            saveDeckToCache(vd);
        }

        vocabss.push(vd.vocabs);
        v_decks.push(vd);
    }

    console.log(`[${Date.now() - startTime}] Done with fetching`);

    // get vocab state of all decks in one request, then merge it back into the individual ones
    const vocab_ids = merge_vocab(vocabss, 1);
    const vocabs_looked_up = await lookupVocab(token, vocab_ids);
    const vocabs_map = new Map();
    for (const vocab of vocabs_looked_up) {
        const key = `${vocab.vid},${vocab.sid}`;
        vocabs_map.set(key, vocab);
    }
    console.log(`[${Date.now() - startTime}] Done with lookup`);

    decks = v_decks.map((deck) => {
        let r: VocabWithStateFrequency[] = [];
        for (const vocab of deck.vocabs) {
            const key = `${vocab.vid},${vocab.sid}`;
            let stateful = vocabs_map.get(key);
            r.push({
                ...vocab,
                state: stateful.state,
                frequency: stateful.frequency,
            });
        }
        console.log(`[${Date.now() - startTime}] Done with ${deck.name}`);
        return { ...deck, vocabs: r };
    });
    return decks;
}