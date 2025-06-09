import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(
    to bottom right,
    ${(props) => props.theme.colors.primary_1},
    ${(props) => props.theme.colors.primary_2}
  );
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const DownloadButton = styled.a`
  width: 100%;
  white-space: nowrap;
  background: ${(props) => props.theme.colors.secondary_2};
  color: white;
  padding: 1.5rem 3rem;
  border-radius: 30px;
  font-size: 1.2rem;
  margin: 1rem;
  text-decoration: none;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

export const MobileDownload = () => {
  return (
    <Container>
      <Title>Baixe nosso aplicativo mobile</Title>
      <DownloadButton href="#android-download-link">
        Download para Android
      </DownloadButton>
      <DownloadButton href="#ios-download-link">
        Download para iOS
      </DownloadButton>
      <p style={{ color: "white", marginTop: "2rem" }}>
        Acesse pelo computador para usar a versão web
      </p>
    </Container>
  );
};
