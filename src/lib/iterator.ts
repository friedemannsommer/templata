function iterator(initial: number): () => number {
    return (): number => {
        return initial++
    }
}

export default iterator