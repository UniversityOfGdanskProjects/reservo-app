export default function StartingPage() {
    const onRegistryClick = () => {
        
    }
    return (
        <div className="registry-login">
            <button className="account" onClick={onRegistryClick}>
                Utwórz konto
            </button>
            <button className="account" onClick={onLoginClick}>
                Zaloguj się
            </button>
        </div>
    )
}