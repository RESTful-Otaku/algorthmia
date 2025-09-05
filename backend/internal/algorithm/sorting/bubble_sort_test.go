package sorting

import (
	"context"
	"testing"

	"algorthmia/backend/internal/models"
)

func TestBubbleSort_Execute(t *testing.T) {
	bs := NewBubbleSort()
	ctx := context.Background()

	tests := []struct {
		name     string
		config   models.AlgorithmConfig
		wantErr  bool
		minSteps int
	}{
		{
			name: "small array",
			config: models.AlgorithmConfig{
				ArraySize: 5,
				Speed:     5,
			},
			wantErr:  false,
			minSteps: 10,
		},
		{
			name: "medium array",
			config: models.AlgorithmConfig{
				ArraySize: 10,
				Speed:     5,
			},
			wantErr:  false,
			minSteps: 20,
		},
		{
			name: "with custom data",
			config: models.AlgorithmConfig{
				ArraySize: 3,
				Speed:     5,
				Data:      []int{3, 1, 2},
			},
			wantErr:  false,
			minSteps: 5,
		},
		{
			name: "invalid array size",
			config: models.AlgorithmConfig{
				ArraySize: 0,
				Speed:     5,
			},
			wantErr: true,
		},
		{
			name: "array size too large",
			config: models.AlgorithmConfig{
				ArraySize: 2000,
				Speed:     5,
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			steps, err := bs.Execute(ctx, tt.config)
			
			if (err != nil) != tt.wantErr {
				t.Errorf("BubbleSort.Execute() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if !tt.wantErr {
				if len(steps) < tt.minSteps {
					t.Errorf("BubbleSort.Execute() got %d steps, want at least %d", len(steps), tt.minSteps)
				}

				// Check that the final step has sorted data
				if len(steps) > 0 {
					lastStep := steps[len(steps)-1]
					if lastStep.Action != "complete" {
						t.Errorf("BubbleSort.Execute() last step action = %v, want 'complete'", lastStep.Action)
					}

					// Verify data is sorted
					if !isSorted(lastStep.Data) {
						t.Errorf("BubbleSort.Execute() final data is not sorted: %v", lastStep.Data)
					}
				}
			}
		})
	}
}

func TestBubbleSort_ValidateConfig(t *testing.T) {
	bs := NewBubbleSort()

	tests := []struct {
		name    string
		config  models.AlgorithmConfig
		wantErr bool
	}{
		{
			name: "valid config",
			config: models.AlgorithmConfig{
				ArraySize: 10,
				Speed:     5,
			},
			wantErr: false,
		},
		{
			name: "invalid array size - too small",
			config: models.AlgorithmConfig{
				ArraySize: 0,
				Speed:     5,
			},
			wantErr: true,
		},
		{
			name: "invalid array size - too large",
			config: models.AlgorithmConfig{
				ArraySize: 2000,
				Speed:     5,
			},
			wantErr: true,
		},
		{
			name: "mismatched data length",
			config: models.AlgorithmConfig{
				ArraySize: 10,
				Speed:     5,
				Data:      []int{1, 2, 3}, // Length 3, but ArraySize is 10
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := bs.ValidateConfig(tt.config)
			if (err != nil) != tt.wantErr {
				t.Errorf("BubbleSort.ValidateConfig() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestBubbleSort_GetMetadata(t *testing.T) {
	bs := NewBubbleSort()
	metadata := bs.GetMetadata()

	if metadata.ID != "bubble_sort" {
		t.Errorf("BubbleSort.GetMetadata() ID = %v, want 'bubble_sort'", metadata.ID)
	}

	if metadata.Name != "Bubble Sort" {
		t.Errorf("BubbleSort.GetMetadata() Name = %v, want 'Bubble Sort'", metadata.Name)
	}

	if metadata.Type != models.AlgorithmTypeSorting {
		t.Errorf("BubbleSort.GetMetadata() Type = %v, want 'sorting'", metadata.Type)
	}

	if !metadata.Enabled {
		t.Errorf("BubbleSort.GetMetadata() Enabled = %v, want true", metadata.Enabled)
	}
}

func TestBubbleSort_GetDefaultConfig(t *testing.T) {
	bs := NewBubbleSort()
	config := bs.GetDefaultConfig()

	if config.ArraySize != 20 {
		t.Errorf("BubbleSort.GetDefaultConfig() ArraySize = %v, want 20", config.ArraySize)
	}

	if config.Speed != 5 {
		t.Errorf("BubbleSort.GetDefaultConfig() Speed = %v, want 5", config.Speed)
	}

	if len(config.Data) != 0 {
		t.Errorf("BubbleSort.GetDefaultConfig() Data length = %v, want 0", len(config.Data))
	}
}
