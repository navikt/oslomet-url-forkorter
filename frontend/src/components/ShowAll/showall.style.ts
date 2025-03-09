import styled from "styled-components";

export const TableContainer = styled.div`
    width: 60vw;
    margin: 20px auto;
    padding: 15px;
    border-radius: 10px;
    background-color: #fdfdfd;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
`;

export const TableHeader = styled.thead`
    background-color: var(--theme-color);
    color: white;
`;

export const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f8f9fa;
    }
`;

export const TableCell = styled.td`
    padding: 6px;
    position: relative;
    border: 1px solid #ddd;
    text-align: left;
    font-size: 14px;
`;

export const TableHeaderCell = styled.th`
    padding: 7px;
    text-align: left;
    font-size: 14px;
    border: 1px solid #ddd;
`;

export const StyledLink = styled.a`
    color: var(--theme-color);
    text-decoration: none;
    font-weight: bold;

    &:hover {
        text-decoration: underline;
    }
`;

export const IconContainer = styled.div`
    display: flex;
    align-items: center;
    gap: .4rem;
    width: 100%;
`
