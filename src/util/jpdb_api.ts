export { jpdbRequest, fetchDeckVocab, lookupVocab };
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
                )
            ]
            | ["locked", "new" | "due" | "failed"]
            | ["redundant", "locked"] // Weird outlier, might either be due or failed
            | ["not-in-deck"]
        );

    interface VocabWithState extends Vocab {
        state: CardState;
        frequency: number;
    }

    interface DeckWithVocab extends Deck {
        vocabs: Vocab[];
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

async function lookupVocab(token: string, vocabs: Vocab[]): Promise<VocabWithState[]> {
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