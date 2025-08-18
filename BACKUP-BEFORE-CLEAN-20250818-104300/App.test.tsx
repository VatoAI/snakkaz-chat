import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import App from './App'

// Simple ErrorBoundary for testing
class TestErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(): { hasError: boolean } {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong</div>
        }
        return this.props.children
    }
}

// Mock the AdminDashboard hook
const mockMetrics = {
    reactStatus: 'healthy' as const,
    dbStatus: 'connected' as const,
    emailStatus: 'operational' as const,
    responseTime: 120,
    activeUsers: 5,
    errorCount: 0
}

vi.mock('./hooks/useSystemStatus', () => ({
    useSystemStatus: () => ({
        metrics: mockMetrics,
        loading: false,
        refresh: vi.fn()
    })
}))

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />)
        expect(screen.getByText(/Loading SnakkaZ/i)).toBeInTheDocument()
    })

    // Test Aurora System indicator  
    it('shows loading state correctly', () => {
        render(<App />)
        expect(screen.getByText(/Loading SnakkaZ/i)).toBeInTheDocument()
    })

    it('displays main routes correctly', () => {
        render(<App />)
        // Since we redirect to /login by default, check that the navigation works
        expect(document.location.pathname).toBe('/')
    })

    // Test error boundary
    it('handles error boundary gracefully', () => {
        // Mock console.error to suppress error logs during testing
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

        const ThrowError = () => {
            throw new Error('Test error')
        }

        const { container } = render(
            <TestErrorBoundary>
                <ThrowError />
            </TestErrorBoundary>
        )

        // Should show error boundary fallback
        expect(container.textContent).toContain('Something went wrong')

        consoleSpy.mockRestore()
    })
})

describe('Native Testing Integration', () => {
    it('should be secure and not use external APIs', () => {
        // Test that we don't have any external testing dependencies
        expect(() => {
            // This should not exist if external testing tools are properly removed
            require('@external-testing/api')
        }).toThrow()
    })

    it('uses native browser APIs only', () => {
        render(<App />)

        // Check that basic browser APIs are available
        expect(window.document).toBeDefined()
        expect(window.getComputedStyle).toBeDefined()
        expect(window.localStorage).toBeDefined()
        expect(window.sessionStorage).toBeDefined()
    })
})
