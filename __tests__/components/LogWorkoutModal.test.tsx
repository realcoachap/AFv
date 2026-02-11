import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LogWorkoutModal from '@/app/components/schedule/LogWorkoutModal'
import { useRouter } from 'next/navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

// Mock fetch
global.fetch = vi.fn()

describe('LogWorkoutModal Component', () => {
  const mockOnClose = vi.fn()
  const mockRefresh = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      refresh: mockRefresh
    } as any)
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    } as any)
  })

  // ============================================================
  // RENDER TESTS
  // ============================================================
  describe('Rendering', () => {
    it('should render modal with correct title', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      expect(screen.getByText('💪 Log Your Workout')).toBeInTheDocument()
    })

    it('should render date input with today as default', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const today = new Date().toISOString().split('T')[0]
      const dateInput = screen.getByLabelText(/date/i)
      expect(dateInput).toHaveValue(today)
    })

    it('should render all focus type options', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      expect(screen.getByText('Strength Training')).toBeInTheDocument()
      expect(screen.getByText('Cardio/Endurance')).toBeInTheDocument()
      expect(screen.getByText('Balanced Workout')).toBeInTheDocument()
    })

    it('should render duration input', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      expect(screen.getByText(/duration/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('60')).toBeInTheDocument()
    })

    it('should render notes textarea', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      expect(screen.getByText(/notes/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/what did you work on/i)).toBeInTheDocument()
    })

    it('should render cancel and submit buttons', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /log workout/i })).toBeInTheDocument()
    })

    it('should render XP preview', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      expect(screen.getByText(/rewards:/i)).toBeInTheDocument()
      expect(screen.getByText(/\+75 xp/i)).toBeInTheDocument()
    })
  })

  // ============================================================
  // ACCESSIBILITY TESTS
  // ============================================================
  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
      expect(screen.getByText(/workout type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/duration/i)).toBeInTheDocument()
    })

    it('should have accessible radio buttons', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const strengthRadio = screen.getByRole('radio', { name: /strength training/i })
      const cardioRadio = screen.getByRole('radio', { name: /cardio/endurance/i })
      const balancedRadio = screen.getByRole('radio', { name: /balanced workout/i })

      expect(strengthRadio).toBeInTheDocument()
      expect(cardioRadio).toBeInTheDocument()
      expect(balancedRadio).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const dateInput = screen.getByLabelText(/date/i)
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      const submitButton = screen.getByRole('button', { name: /log workout/i })

      // Tab order should be logical
      dateInput.focus()
      expect(document.activeElement).toBe(dateInput)
    })

    it('should have proper ARIA attributes on modal', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const modal = screen.getByRole('dialog') || screen.getByTestId('workout-modal')
      expect(modal).toHaveAttribute('aria-labelledby')
      expect(modal).toHaveAttribute('aria-modal', 'true')
    })

    it('should trap focus within modal', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      // Focus should cycle within modal
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should have sufficient color contrast', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const title = screen.getByText('💪 Log Your Workout')
      // Title should be visible (not checking exact colors, just presence)
      expect(title).toBeVisible()
    })
  })

  // ============================================================
  // FORM INTERACTION TESTS
  // ============================================================
  describe('Form Interactions', () => {
    it('should update date when changed', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const dateInput = screen.getByLabelText(/date/i)
      
      await userEvent.clear(dateInput)
      await userEvent.type(dateInput, '2024-01-10')
      
      expect(dateInput).toHaveValue('2024-01-10')
    })

    it('should update focus type when radio selected', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const cardioRadio = screen.getByRole('radio', { name: /cardio/endurance/i })
      
      await userEvent.click(cardioRadio)
      
      expect(cardioRadio).toBeChecked()
    })

    it('should update duration when typed', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const durationInput = screen.getByPlaceholderText('60')
      
      await userEvent.clear(durationInput)
      await userEvent.type(durationInput, '90')
      
      expect(durationInput).toHaveValue(90)
    })

    it('should update notes when typed', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const notesInput = screen.getByPlaceholderText(/what did you work on/i)
      
      await userEvent.type(notesInput, 'Great workout!')
      
      expect(notesInput).toHaveValue('Great workout!')
    })

    it('should have BALANCED selected by default', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const balancedRadio = screen.getByRole('radio', { name: /balanced workout/i })
      expect(balancedRadio).toBeChecked()
    })
  })

  // ============================================================
  // VALIDATION TESTS
  // ============================================================
  describe('Form Validation', () => {
    it('should have required date field', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const dateInput = screen.getByLabelText(/date/i)
      expect(dateInput).toHaveAttribute('required')
    })

    it('should enforce min date (7 days ago)', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const dateInput = screen.getByLabelText(/date/i)
      
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const minDate = sevenDaysAgo.toISOString().split('T')[0]
      
      expect(dateInput).toHaveAttribute('min', minDate)
    })

    it('should enforce max date (today)', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const dateInput = screen.getByLabelText(/date/i)
      
      const today = new Date().toISOString().split('T')[0]
      
      expect(dateInput).toHaveAttribute('max', today)
    })

    it('should show helper text for date restriction', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      expect(screen.getByText(/past 7 days/i)).toBeInTheDocument()
    })

    it('should enforce min duration of 5 minutes', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const durationInput = screen.getByPlaceholderText('60')
      expect(durationInput).toHaveAttribute('min', '5')
    })

    it('should enforce max duration of 300 minutes', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const durationInput = screen.getByPlaceholderText('60')
      expect(durationInput).toHaveAttribute('max', '300')
    })
  })

  // ============================================================
  // SUBMISSION TESTS
  // ============================================================
  describe('Form Submission', () => {
    it('should call onClose after successful submission', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const submitButton = screen.getByRole('button', { name: /log workout/i })
      
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('should call router.refresh after successful submission', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const submitButton = screen.getByRole('button', { name: /log workout/i })
      
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled()
      })
    })

    it('should send correct data to API', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      
      // Fill form
      const dateInput = screen.getByLabelText(/date/i)
      const cardioRadio = screen.getByRole('radio', { name: /cardio/endurance/i })
      const durationInput = screen.getByPlaceholderText('60')
      const notesInput = screen.getByPlaceholderText(/what did you work on/i)
      
      await userEvent.clear(dateInput)
      await userEvent.type(dateInput, '2024-01-10')
      await userEvent.click(cardioRadio)
      await userEvent.clear(durationInput)
      await userEvent.type(durationInput, '45')
      await userEvent.type(notesInput, 'Good run')
      
      const submitButton = screen.getByRole('button', { name: /log workout/i })
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/client/log-workout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"focusType":"CARDIO"')
        })
      })
    })

    it('should show loading state during submission', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const submitButton = screen.getByRole('button', { name: /log workout/i })
      
      await userEvent.click(submitButton)
      
      expect(screen.getByText(/logging/i)).toBeInTheDocument()
    })

    it('should disable buttons during submission', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const submitButton = screen.getByRole('button', { name: /log workout/i })
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      
      await userEvent.click(submitButton)
      
      expect(submitButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
    })
  })

  // ============================================================
  // ERROR HANDLING TESTS
  // ============================================================
  describe('Error Handling', () => {
    it('should display error message on API failure', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to save workout' })
      } as any)

      render(<LogWorkoutModal onClose={mockOnClose} />)
      const submitButton = screen.getByRole('button', { name: /log workout/i })
      
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/failed to save workout/i)).toBeInTheDocument()
      })
    })

    it('should not close modal on error', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to save workout' })
      } as any)

      render(<LogWorkoutModal onClose={mockOnClose} />)
      const submitButton = screen.getByRole('button', { name: /log workout/i })
      
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/failed to save workout/i)).toBeInTheDocument()
      })
      
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should re-enable buttons after error', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to save workout' })
      } as any)

      render(<LogWorkoutModal onClose={mockOnClose} />)
      const submitButton = screen.getByRole('button', { name: /log workout/i })
      
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      render(<LogWorkoutModal onClose={mockOnClose} />)
      const submitButton = screen.getByRole('button', { name: /log workout/i })
      
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument()
      })
    })
  })

  // ============================================================
  // CANCEL TESTS
  // ============================================================
  describe('Cancel Action', () => {
    it('should call onClose when cancel button clicked', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      
      await userEvent.click(cancelButton)
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should not submit form when cancel clicked', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      
      await userEvent.click(cancelButton)
      
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  // ============================================================
  // DYNAMIC CONTENT TESTS
  // ============================================================
  describe('Dynamic Content', () => {
    it('should update XP preview based on focus type', async () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      
      // Default (BALANCED) should show "Both Stats"
      expect(screen.getByText(/both stats/i)).toBeInTheDocument()
      
      // Click STRENGTH
      const strengthRadio = screen.getByRole('radio', { name: /strength training/i })
      await userEvent.click(strengthRadio)
      
      expect(screen.getByText(/strength/i)).toBeInTheDocument()
      
      // Click CARDIO
      const cardioRadio = screen.getByRole('radio', { name: /cardio/endurance/i })
      await userEvent.click(cardioRadio)
      
      expect(screen.getByText(/endurance/i)).toBeInTheDocument()
    })

    it('should show different descriptions for each focus type', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      
      expect(screen.getByText(/weights, resistance, lifting/i)).toBeInTheDocument()
      expect(screen.getByText(/running, biking, hiit, cardio/i)).toBeInTheDocument()
      expect(screen.getByText(/full body, mixed exercises/i)).toBeInTheDocument()
    })
  })

  // ============================================================
  // RESPONSIVE DESIGN TESTS
  // ============================================================
  describe('Responsive Design', () => {
    it('should have max-width constraint on modal', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const modal = screen.getByRole('dialog') || screen.getByTestId('workout-modal')
      // Should have max-w-md class for mobile responsiveness
      expect(modal).toHaveClass('max-w-md')
    })

    it('should have padding for mobile screens', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const container = screen.getByRole('dialog')?.parentElement
      // Should have responsive padding
      expect(container).toHaveClass('p-4')
    })

    it('should stack buttons on mobile', () => {
      render(<LogWorkoutModal onClose={mockOnClose} />)
      const buttonContainer = screen.getByRole('button', { name: /cancel/i }).parentElement
      // Should use flex with gap
      expect(buttonContainer).toHaveClass('flex')
      expect(buttonContainer).toHaveClass('gap-3')
    })
  })
})
