package main

import (
	"fmt"
	"game-server-watcher/pkg/cmd/server"
	"log"

	"github.com/spf13/cobra"
	"go.uber.org/zap"
	"gopkg.in/DataDog/dd-trace-go.v1/ddtrace/tracer"
	"gopkg.in/DataDog/dd-trace-go.v1/profiler"
)

func main() {
	tracer.Start(
		tracer.WithService("game-server-watcher"),
		tracer.WithEnv("env"),
	)
	defer tracer.Stop()

	err := profiler.Start(
		profiler.WithService("game-server-watcher"),
		profiler.WithEnv("env"),
		profiler.WithProfileTypes(
			profiler.CPUProfile,
			profiler.HeapProfile,

			// The profiles below are disabled by
			// default to keep overhead low, but
			// can be enabled as needed.
			// profiler.BlockProfile,
			// profiler.MutexProfile,
			// profiler.GoroutineProfile,
		),
	)
	if err != nil {
		log.Fatal(err)
	}
	defer profiler.Stop()

	logger, _ := zap.NewProduction()
	defer logger.Sync()

	rootCmd := cobra.Command{
		Use: "game-server-watcher",
		RunE: func(cmd *cobra.Command, args []string) error {
			return fmt.Errorf("No command selected")
		},
	}

	rootCmd.AddCommand(server.Commands(logger)...)

	if err := rootCmd.Execute(); err != nil {
		logger.Error("Command not found", zap.Error(err))
	}
}
