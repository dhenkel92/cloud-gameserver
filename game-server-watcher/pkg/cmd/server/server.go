package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/spf13/cobra"
	"go.uber.org/zap"
	muxtrace "gopkg.in/DataDog/dd-trace-go.v1/contrib/gorilla/mux"
)

type ServerOpts struct {
	port int
}

func Commands(logger *zap.Logger) []*cobra.Command {
	var serverOpts ServerOpts
	serverCmd := &cobra.Command{
		Use:   "server",
		Short: "Starting http server",
		Args:  cobra.ExactArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			return runServer(logger, serverOpts)
		},
	}
	serverCmd.Flags().IntVar(&serverOpts.port, "port", 8080, "Port used to do stuff")

	return []*cobra.Command{serverCmd}
}

type Port struct {
	Port     int    `json:"port"`
	Protocol string `json:"protocol"`
	IsOpen   bool   `json:"is_open"`
}

func runServer(logger *zap.Logger, opts ServerOpts) error {
	mux := muxtrace.NewRouter()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Accessed endpoint")
		w.Write([]byte("Hello World!"))
	})

	mux.HandleFunc("/ports", func(w http.ResponseWriter, r *http.Request) {
		ports := []Port{{Port: 8080, IsOpen: false, Protocol: "TCP"}}
		data, _ := json.Marshal(ports)
		w.Header().Add("Content-Type", "application/json")
		w.Write(data)
	})

	logger.Info("Starting server")
	return http.ListenAndServe(fmt.Sprintf(":%d", opts.port), mux)
}
