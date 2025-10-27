package grpc

import (
	"context"
	"soal-service/internal/models"
	pb "soal-service/internal/proto/soal" // Import generated code
	"soal-service/internal/services"

	"github.com/vityasyyy/sharedlib/logger"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Server implements the pb.SoalServiceServer interface
type Server struct {
	pb.UnimplementedSoalServiceServer
	soalService services.SoalService
}

func NewGRPCServer(s services.SoalService) *Server {
	return &Server{soalService: s}
}

// GetAnswerKey is the gRPC handler
func (s *Server) GetAnswerKey(ctx context.Context, req *pb.GetAnswerKeyRequest) (*pb.GetAnswerKeyResponse, error) {
	// 1. Call the existing service
	answerKeys, err := s.soalService.GetAnswerKeyByPaketAndSubtest(ctx, req.PaketSoal, req.Subtest)
	if err != nil {
		logger.LogErrorCtx(ctx, err, "gRPC: failed to get answer key from service",
			map[string]any{"paket": req.PaketSoal, "subtest": req.Subtest})
		return nil, status.Errorf(codes.Internal, "could not retrieve answer key: %v", err)
	}

	// 2. Convert internal model to gRPC response
	grpcResponse, err := convertModelToProto(answerKeys)
	if err != nil {
		logger.LogErrorCtx(ctx, err, "gRPC: failed to convert model to proto",
			map[string]any{"paket": req.PaketSoal, "subtest": req.Subtest})
		return nil, status.Errorf(codes.Internal, "could not process answer key: %v", err)
	}

	return grpcResponse, nil
}

// convertModelToProto converts the internal models.AnswerKeys to the gRPC pb.GetAnswerKeyResponse
func convertModelToProto(keys *models.AnswerKeys) (*pb.GetAnswerKeyResponse, error) {
	resp := &pb.GetAnswerKeyResponse{
		PilihanGandaAnswers: make(map[string]*pb.PilihanGandaMap),
		TrueFalseAnswers:    make(map[string]*pb.TrueFalseAnswer),
		UraianAnswers:       make(map[string]*pb.UraianAnswer),
	}

	// Convert Pilihan Ganda
	for kodeSoal, choices := range keys.PilihanGandaAnswers {
		grpcChoices := make(map[string]*pb.PilihanGandaChoice)
		for choiceID, choice := range choices {
			grpcChoices[choiceID] = &pb.PilihanGandaChoice{
				IsCorrect:   choice.IsCorrect,
				Bobot:       int32(choice.Bobot),
				TextPilihan: choice.TextPilihan,
				Pembahasan:  choice.Pembahasan,
			}
		}
		resp.PilihanGandaAnswers[kodeSoal] = &pb.PilihanGandaMap{Choices: grpcChoices}
	}

	// Convert True False
	for kodeSoal, answer := range keys.TrueFalseAnswers {
		resp.TrueFalseAnswers[kodeSoal] = &pb.TrueFalseAnswer{
			Jawaban:     answer.Jawaban,
			Bobot:       int32(answer.Bobot),
			TextPilihan: answer.TextPilihan,
			Pembahasan:  answer.Pembahasan,
		}
	}

	// Convert Uraian
	for kodeSoal, answer := range keys.UraianAnswers {
		resp.UraianAnswers[kodeSoal] = &pb.UraianAnswer{
			Jawaban:    answer.Jawaban,
			Bobot:      int32(answer.Bobot),
			Pembahasan: answer.Pembahasan,
		}
	}

	return resp, nil
}
