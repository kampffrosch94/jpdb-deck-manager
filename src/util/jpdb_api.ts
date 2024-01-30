export { jpdbRequest };
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