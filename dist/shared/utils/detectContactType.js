function detectContactType(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (emailRegex.test(input))
        return 'email';
    if (phoneRegex.test(input))
        return 'phone';
    return 'invalid';
}
export { detectContactType };
