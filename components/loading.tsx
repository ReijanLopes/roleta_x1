export default function Loading({className}: {className?: string}) {
    return (
        <div className={`${className ? className : "w-12 h-12"} rounded-full border-4 border-t-transparent animate-spin border-blue-400 mx-auto`} />
    )
}