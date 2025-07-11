# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy everything
COPY . .

# Restore using the solution
RUN dotnet restore "Taskolith.sln"

# Build the API project
WORKDIR /src/Taskolith.API
RUN dotnet publish -c Release -o /app/out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 8080
EXPOSE 8081
ENTRYPOINT ["dotnet", "Taskolith.API.dll"]