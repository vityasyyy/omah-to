PROTO_DIR = ../proto
OUT_DIR = internal/proto

SOAL_PROTO_FILES = $(PROTO_DIR)/soal/soal.proto

gen:
	protoc \
		-I $(PROTO_DIR) \
		--go_out=$(OUT_DIR) --go_opt=paths=source_relative \
		--go-grpc_out=$(OUT_DIR) --go-grpc_opt=paths=source_relative \
		$(SOAL_PROTO_FILES)

.PHONY: gen

