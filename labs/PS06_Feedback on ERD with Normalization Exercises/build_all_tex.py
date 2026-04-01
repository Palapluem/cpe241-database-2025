import os

tex_content = r'''\documentclass[a4paper,10pt]{article}
\usepackage{fontspec}
\setmainfont{TH Sarabun New}[Scale=1.3]
\usepackage{tikz}
\usetikzlibrary{positioning, calc}
\usepackage{geometry}
\geometry{margin=1in}
\usepackage{ulem}

\begin{document}
\begin{center}
    \textbf{\Large เฉลย Normalization แบบละเอียดครบ 3 Tables (Lab 06 - Appendix)}\\
\end{center}

\vspace{0.5cm}

% =========================================================================
% TABLE 1
% =========================================================================
\section*{Table 1: Students-Courses-Grades}

\textbf{1NF :}\\
\vspace{0.2cm}
\begin{center}
\resizebox{\textwidth}{!}{
\begin{tikzpicture}[
    cell/.style={draw, rectangle, minimum height=0.7cm, text centered, inner sep=0.15cm, font=\sffamily, text=blue!80!black},
    every node/.style={outer sep=0pt}
]
\node[cell] (c1) at (0,0) {\underline{Email}};
\node[cell, right=0cm of c1] (c2) {\underline{CourseName}};
\node[cell, right=0cm of c2] (c3) {FName};
\node[cell, right=0cm of c3] (c4) {LName};
\node[cell, right=0cm of c4] (c5) {Phone};
\node[cell, right=0cm of c5] (c6) {DeptName};
\node[cell, right=0cm of c6] (c7) {GPA};
\node[cell, right=0cm of c7] (c8) {CourseDesc};
\node[cell, right=0cm of c8] (c9) {Credit};
\node[cell, right=0cm of c9] (c10) {RegDate};
\node[cell, right=0cm of c10] (c11) {Grade};

% Partial Email (Red)
\draw[-latex, draw=red, thick] ($(c3.south)-(0, 0.4)$) -- ($(c3.south)$);
\draw[-latex, draw=red, thick] ($(c4.south)-(0, 0.4)$) -- ($(c4.south)$);
\draw[-latex, draw=red, thick] ($(c5.south)-(0, 0.4)$) -- ($(c5.south)$);
\draw[-latex, draw=red, thick] ($(c6.south)-(0, 0.4)$) -- ($(c6.south)$);
\draw[-latex, draw=red, thick] ($(c7.south)-(0, 0.4)$) -- ($(c7.south)$);
\draw[draw=red, thick] ($(c1.south)-(0, 0.4)$) -- ($(c7.south)-(0, 0.4)$);
\draw[draw=red, thick] ($(c1.south)-(0, 0.4)$) -- ($(c1.south)$);

% Partial CourseName (Green)
\draw[-latex, draw=green!60!black, thick] ($(c8.south)-(0, 0.7)$) -- ($(c8.south)$);
\draw[-latex, draw=green!60!black, thick] ($(c9.south)-(0, 0.7)$) -- ($(c9.south)$);
\draw[draw=green!60!black, thick] ($(c2.south)-(0, 0.7)$) -- ($(c9.south)-(0, 0.7)$);
\draw[draw=green!60!black, thick] ($(c2.south)-(0, 0.7)$) -- ($(c2.south)$);

% Full Dependency (Magenta)
\draw[-latex, draw=magenta, thick] ($(c10.south)-(0, 1.0)$) -- ($(c10.south)$);
\draw[-latex, draw=magenta, thick] ($(c11.south)-(0, 1.0)$) -- ($(c11.south)$);
\coordinate (mid12) at ($(c1.south)!0.5!(c2.south)$);
\draw[draw=magenta, thick] ($(mid12)-(0, 1.0)$) -- ($(c11.south)-(0, 1.0)$);
\draw[draw=magenta, thick] ($(mid12)-(0, 1.0)$) -- ($(mid12)$);

\end{tikzpicture}
}
\end{center}

\vspace{0.8cm}
\textbf{2NF :}\\
\vspace{0.2cm}
\begin{center}
\resizebox{0.9\textwidth}{!}{
\begin{tikzpicture}[
    cell/.style={draw, rectangle, minimum height=0.7cm, text centered, inner sep=0.15cm, font=\sffamily, text=blue!80!black},
    every node/.style={outer sep=0pt}
]
% STUDENT
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t1) at (0, 0) {STUDENT};
\node[cell, below right=0cm and 0cm of t1.south west] (a1_1) {\underline{Email}};
\node[cell, right=0cm of a1_1] (a1_2) {FName};
\node[cell, right=0cm of a1_2] (a1_3) {LName};
\node[cell, right=0cm of a1_3] (a1_4) {DeptName};
\node[cell, right=0cm of a1_4] (a1_5) {GPA};
\draw[-latex, draw=red, thick] ($(a1_2.south)-(0, 0.3)$) -- ($(a1_2.south)$);
\draw[-latex, draw=red, thick] ($(a1_3.south)-(0, 0.3)$) -- ($(a1_3.south)$);
\draw[-latex, draw=red, thick] ($(a1_4.south)-(0, 0.3)$) -- ($(a1_4.south)$);
\draw[-latex, draw=red, thick] ($(a1_5.south)-(0, 0.3)$) -- ($(a1_5.south)$);
\draw[draw=red, thick] ($(a1_1.south)-(0, 0.3)$) -- ($(a1_5.south)-(0, 0.3)$);
\draw[draw=red, thick] ($(a1_1.south)-(0, 0.3)$) -- ($(a1_1.south)$);

% COURSE
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t2) at (8, 0) {COURSE};
\node[cell, below right=0cm and 0cm of t2.south west] (a2_1) {\underline{CourseName}};
\node[cell, right=0cm of a2_1] (a2_2) {CourseDesc};
\node[cell, right=0cm of a2_2] (a2_3) {Credit};
\draw[-latex, draw=green!60!black, thick] ($(a2_2.south)-(0, 0.3)$) -- ($(a2_2.south)$);
\draw[-latex, draw=green!60!black, thick] ($(a2_3.south)-(0, 0.3)$) -- ($(a2_3.south)$);
\draw[draw=green!60!black, thick] ($(a2_1.south)-(0, 0.3)$) -- ($(a2_3.south)-(0, 0.3)$);
\draw[draw=green!60!black, thick] ($(a2_1.south)-(0, 0.3)$) -- ($(a2_1.south)$);

% ENROLLMENT
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t3) at (4, -2.5) {ENROLLMENT};
\node[cell, below right=0cm and 0cm of t3.south west] (a3_1) {\underline{Email}};
\node[cell, right=0cm of a3_1] (a3_2) {\underline{CourseName}};
\node[cell, right=0cm of a3_2] (a3_3) {RegDate};
\node[cell, right=0cm of a3_3] (a3_4) {Grade};
\draw[-latex, draw=magenta, thick] ($(a3_3.south)-(0, 0.3)$) -- ($(a3_3.south)$);
\draw[-latex, draw=magenta, thick] ($(a3_4.south)-(0, 0.3)$) -- ($(a3_4.south)$);
\coordinate (m1) at ($(a3_1.south)!0.5!(a3_2.south)$);
\draw[draw=magenta, thick] ($(m1)-(0, 0.3)$) -- ($(a3_4.south)-(0, 0.3)$);
\draw[draw=magenta, thick] ($(m1)-(0, 0.3)$) -- ($(m1)$);
\end{tikzpicture}
}
\end{center}

\vspace{0.8cm}
\textbf{3NF :} (เหมือน 2NF เนื่องจากไม่มี Transitive Dependency)\\
\vspace{0.2cm}
\begin{center}
\resizebox{0.9\textwidth}{!}{
\begin{tikzpicture}[
    cell/.style={draw, rectangle, minimum height=0.7cm, text centered, inner sep=0.15cm, font=\sffamily, text=blue!80!black},
    every node/.style={outer sep=0pt}
]
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t1) at (0, 0) {STUDENT};
\node[cell, below right=0cm and 0cm of t1.south west] (a1_1) {\underline{Email}};
\node[cell, right=0cm of a1_1] (a1_2) {FName};
\node[cell, right=0cm of a1_2] (a1_3) {LName};
\node[cell, right=0cm of a1_3] (a1_4) {DeptName};
\node[cell, right=0cm of a1_4] (a1_5) {GPA};

\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t2) at (8, 0) {COURSE};
\node[cell, below right=0cm and 0cm of t2.south west] (a2_1) {\underline{CourseName}};
\node[cell, right=0cm of a2_1] (a2_2) {CourseDesc};
\node[cell, right=0cm of a2_2] (a2_3) {Credit};

\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t3) at (4, -2.5) {ENROLLMENT (Main Table)};
\node[cell, below right=0cm and 0cm of t3.south west] (a3_1) {\underline{Email}};
\node[cell, right=0cm of a3_1] (a3_2) {\underline{CourseName}};
\node[cell, right=0cm of a3_2] (a3_3) {RegDate};
\node[cell, right=0cm of a3_3] (a3_4) {Grade};

% Relational Links back to PK
\draw[-latex, draw=red!80!black, thick] (a3_1.south) -- +(0,-0.5) -| (a1_1.south);
\draw[-latex, draw=green!60!black, thick] (a3_2.south) -- +(0,-0.7) -| (a2_1.south);
\end{tikzpicture}
}
\end{center}

\newpage
% =========================================================================
% TABLE 2
% =========================================================================
\section*{Table 2: Doctor-Patient-Appointment}

\textbf{1NF :}\\
\vspace{0.2cm}
\begin{center}
\resizebox{\textwidth}{!}{
\begin{tikzpicture}[
    cell/.style={draw, rectangle, minimum height=0.7cm, text centered, inner sep=0.15cm, font=\sffamily, text=blue!80!black},
    every node/.style={outer sep=0pt}
]
\node[cell] (c1) at (0,0) {\underline{DocName}};
\node[cell, right=0cm of c1] (c2) {\underline{PatName}};
\node[cell, right=0cm of c2] (c3) {\underline{ApptDate}};
\node[cell, right=0cm of c3] (c4) {Diagnosis};
\node[cell, right=0cm of c4] (c5) {Treatment};
\node[cell, right=0cm of c5] (c6) {Specialty};
\node[cell, right=0cm of c6] (c7) {DocPhone};
\node[cell, right=0cm of c7] (c8) {Insurance};
\node[cell, right=0cm of c8] (c9) {Hospital};
\node[cell, right=0cm of c9] (c10) {RoomNo};
\node[cell, right=0cm of c10] (c11) {Floor};

% FD1: Full Dependency (Red)
\draw[-latex, draw=red, thick] ($(c4.south)-(0, 0.4)$) -- ($(c4.south)$);
\draw[-latex, draw=red, thick] ($(c5.south)-(0, 0.4)$) -- ($(c5.south)$);
\draw[-latex, draw=red, thick] ($(c9.south)-(0, 0.4)$) -- ($(c9.south)$);
\draw[-latex, draw=red, thick] ($(c10.south)-(0, 0.4)$) -- ($(c10.south)$);
\draw[-latex, draw=red, thick] ($(c11.south)-(0, 0.4)$) -- ($(c11.south)$);
\coordinate (m1) at ($(c2.south)$); % Middle of DocName, PatName, ApptDate
\draw[draw=red, thick] ($(m1)-(0, 0.4)$) -- ($(c11.south)-(0, 0.4)$);
\draw[draw=red, thick] ($(m1)-(0, 0.4)$) -- ($(m1)$);

% FD2: Partial DocName (Green)
\draw[-latex, draw=green!60!black, thick] ($(c6.south)-(0, 0.8)$) -- ($(c6.south)$);
\draw[-latex, draw=green!60!black, thick] ($(c7.south)-(0, 0.8)$) -- ($(c7.south)$);
\draw[draw=green!60!black, thick] ($(c1.south)-(0, 0.8)$) -- ($(c7.south)-(0, 0.8)$);
\draw[draw=green!60!black, thick] ($(c1.south)-(0, 0.8)$) -- ($(c1.south)$);

% FD3: Partial PatName (Magenta)
\draw[-latex, draw=magenta, thick] ($(c8.south)-(0, 1.2)$) -- ($(c8.south)$);
\draw[draw=magenta, thick] ($(c2.south)-(0, 1.2)$) -- ($(c8.south)-(0, 1.2)$);
\draw[draw=magenta, thick] ($(c2.south)-(0, 1.2)$) -- ($(c2.south)$);

\end{tikzpicture}
}
\end{center}

\vspace{0.8cm}
\textbf{2NF :}\\
\vspace{0.2cm}
\begin{center}
\resizebox{0.9\textwidth}{!}{
\begin{tikzpicture}[
    cell/.style={draw, rectangle, minimum height=0.7cm, text centered, inner sep=0.15cm, font=\sffamily, text=blue!80!black},
    every node/.style={outer sep=0pt}
]
% DOCTOR
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t1) at (0, 0) {DOCTOR};
\node[cell, below right=0cm and 0cm of t1.south west] (a1_1) {\underline{DocName}};
\node[cell, right=0cm of a1_1] (a1_2) {Specialty};
\node[cell, right=0cm of a1_2] (a1_3) {DocPhone};
\draw[-latex, draw=green!60!black, thick] ($(a1_2.south)-(0, 0.3)$) -- ($(a1_2.south)$);
\draw[-latex, draw=green!60!black, thick] ($(a1_3.south)-(0, 0.3)$) -- ($(a1_3.south)$);
\draw[draw=green!60!black, thick] ($(a1_1.south)-(0, 0.3)$) -- ($(a1_3.south)-(0, 0.3)$);
\draw[draw=green!60!black, thick] ($(a1_1.south)-(0, 0.3)$) -- ($(a1_1.south)$);

% PATIENT
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t2) at (7, 0) {PATIENT};
\node[cell, below right=0cm and 0cm of t2.south west] (a2_1) {\underline{PatName}};
\node[cell, right=0cm of a2_1] (a2_2) {Insurance};
\draw[-latex, draw=magenta, thick] ($(a2_2.south)-(0, 0.3)$) -- ($(a2_2.south)$);
\draw[draw=magenta, thick] ($(a2_1.south)-(0, 0.3)$) -- ($(a2_2.south)-(0, 0.3)$);
\draw[draw=magenta, thick] ($(a2_1.south)-(0, 0.3)$) -- ($(a2_1.south)$);

% APPOINTMENT
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t3) at (0, -2.5) {APPOINTMENT};
\node[cell, below right=0cm and 0cm of t3.south west] (a3_1) {\underline{DocName}};
\node[cell, right=0cm of a3_1] (a3_2) {\underline{PatName}};
\node[cell, right=0cm of a3_2] (a3_3) {\underline{ApptDate}};
\node[cell, right=0cm of a3_3] (a3_4) {Diagnosis};
\node[cell, right=0cm of a3_4] (a3_5) {Treatment};
\node[cell, right=0cm of a3_5] (a3_6) {Hospital};
\node[cell, right=0cm of a3_6] (a3_7) {RoomNo};
\node[cell, right=0cm of a3_7] (a3_8) {Floor};
\draw[-latex, draw=red, thick] ($(a3_4.south)-(0, 0.3)$) -- ($(a3_4.south)$);
\draw[-latex, draw=red, thick] ($(a3_5.south)-(0, 0.3)$) -- ($(a3_5.south)$);
\draw[-latex, draw=red, thick] ($(a3_6.south)-(0, 0.3)$) -- ($(a3_6.south)$);
\draw[-latex, draw=red, thick] ($(a3_7.south)-(0, 0.3)$) -- ($(a3_7.south)$);
\draw[-latex, draw=red, thick] ($(a3_8.south)-(0, 0.3)$) -- ($(a3_8.south)$);
\coordinate (m2) at ($(a3_2.south)$);
\draw[draw=red, thick] ($(m2)-(0, 0.3)$) -- ($(a3_8.south)-(0, 0.3)$);
\draw[draw=red, thick] ($(m2)-(0, 0.3)$) -- ($(m2)$);

% Transitive FD indicating 2NF is not 3NF
\draw[-latex, draw=blue, thick] ($(a3_8.south)-(0, 0.7)$) -- ($(a3_8.south)$);
\coordinate (trans) at ($(a3_6.south)!0.5!(a3_7.south)$);
\draw[draw=blue, thick] ($(trans)-(0, 0.7)$) -- ($(a3_8.south)-(0, 0.7)$);
\draw[draw=blue, thick] ($(trans)-(0, 0.7)$) -- ($(trans)$);

\end{tikzpicture}
}
\end{center}

\vspace{0.8cm}
\textbf{3NF :}\\
\vspace{0.2cm}
\begin{center}
\resizebox{0.9\textwidth}{!}{
\begin{tikzpicture}[
    cell/.style={draw, rectangle, minimum height=0.7cm, text centered, inner sep=0.15cm, font=\sffamily, text=blue!80!black},
    every node/.style={outer sep=0pt}
]
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t1) at (0, 0) {DOCTOR};
\node[cell, below right=0cm and 0cm of t1.south west] (a1_1) {\underline{DocName}};
\node[cell, right=0cm of a1_1] (a1_2) {Specialty};
\node[cell, right=0cm of a1_2] (a1_3) {DocPhone};

\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t2) at (7, 0) {PATIENT};
\node[cell, below right=0cm and 0cm of t2.south west] (a2_1) {\underline{PatName}};
\node[cell, right=0cm of a2_1] (a2_2) {Insurance};

\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t4) at (12, 0) {ROOM\_INFO};
\node[cell, below right=0cm and 0cm of t4.south west] (a4_1) {\underline{Hospital}};
\node[cell, right=0cm of a4_1] (a4_2) {\underline{RoomNo}};
\node[cell, right=0cm of a4_2] (a4_3) {Floor};

\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t3) at (0, -2.5) {APPOINTMENT\_NEW};
\node[cell, below right=0cm and 0cm of t3.south west] (a3_1) {\underline{DocName}};
\node[cell, right=0cm of a3_1] (a3_2) {\underline{PatName}};
\node[cell, right=0cm of a3_2] (a3_3) {\underline{ApptDate}};
\node[cell, right=0cm of a3_3] (a3_4) {Diagnosis};
\node[cell, right=0cm of a3_4] (a3_5) {Treatment};
\node[cell, right=0cm of a3_5] (a3_6) {Hospital};
\node[cell, right=0cm of a3_6] (a3_7) {RoomNo};

% Links back
\draw[-latex, draw=green!60!black, thick] (a3_1.south) -- +(0,-0.4) -| (a1_1.south);
\draw[-latex, draw=magenta, thick] (a3_2.south) -- +(0,-0.6) -| (a2_1.south);
\draw[-latex, draw=blue, thick] (a3_6.south) -- +(0,-0.8) -| (a4_1.south);
\draw[-latex, draw=blue, thick] (a3_7.south) -- +(0,-1.0) -| (a4_2.south);

\end{tikzpicture}
}
\end{center}

\newpage
% =========================================================================
% TABLE 3
% =========================================================================
\section*{Table 3: Artist-Album-Song}

\textbf{1NF :}\\
\vspace{0.2cm}
\begin{center}
\resizebox{\textwidth}{!}{
\begin{tikzpicture}[
    cell/.style={draw, rectangle, minimum height=0.7cm, text centered, inner sep=0.15cm, font=\sffamily, text=blue!80!black},
    every node/.style={outer sep=0pt}
]
\node[cell] (c1) at (0,0) {\underline{artist}};
\node[cell, right=0cm of c1] (c2) {artistCountry};
\node[cell, right=0cm of c2] (c3) {genre};
\node[cell, right=0cm of c3] (c4) {\underline{albumName}};
\node[cell, right=0cm of c4] (c5) {releaseYear};
\node[cell, right=0cm of c5] (c6) {recordLabel};
\node[cell, right=0cm of c6] (c7) {albumLength};
\node[cell, right=0cm of c7] (c8) {\underline{songTitle}};
\node[cell, right=0cm of c8] (c9) {songTrackNumber};
\node[cell, right=0cm of c9] (c10) {songGenre};
\node[cell, right=0cm of c10] (c11) {songLength};

% Arrows
\draw[-latex, draw=red, thick] ($(c1.south)-(0, 0.4)$) -- ($(c1.south)$);
\draw[-latex, draw=red, thick] ($(c2.south)-(0, 0.4)$) -- ($(c2.south)$);
\draw[-latex, draw=red, thick] ($(c3.south)-(0, 0.4)$) -- ($(c3.south)$);
\draw[draw=red, thick] ($(c1.south)-(0, 0.4)$) -- ($(c3.south)-(0, 0.4)$);

\draw[-latex, draw=green!60!black, thick] ($(c4.south)-(0, 0.7)$) -- ($(c4.south)$);
\draw[-latex, draw=green!60!black, thick] ($(c5.south)-(0, 0.7)$) -- ($(c5.south)$);
\draw[-latex, draw=green!60!black, thick] ($(c6.south)-(0, 0.7)$) -- ($(c6.south)$);
\draw[-latex, draw=green!60!black, thick] ($(c7.south)-(0, 0.7)$) -- ($(c7.south)$);
\draw[draw=green!60!black, thick] ($(c4.south)-(0, 0.7)$) -- ($(c7.south)-(0, 0.7)$);

\draw[-latex, draw=magenta, thick] ($(c8.south)-(0, 0.4)$) -- ($(c8.south)$);
\draw[-latex, draw=magenta, thick] ($(c9.south)-(0, 0.4)$) -- ($(c9.south)$);
\draw[-latex, draw=magenta, thick] ($(c10.south)-(0, 0.4)$) -- ($(c10.south)$);
\draw[-latex, draw=magenta, thick] ($(c11.south)-(0, 0.4)$) -- ($(c11.south)$);
\draw[draw=magenta, thick] ($(c8.south)-(0, 0.4)$) -- ($(c11.south)-(0, 0.4)$);

\end{tikzpicture}
}
\end{center}

\vspace{0.8cm}
\textbf{2NF :}\\
\vspace{0.2cm}
\begin{center}
\resizebox{0.9\textwidth}{!}{
\begin{tikzpicture}[
    cell/.style={draw, rectangle, minimum height=0.7cm, text centered, inner sep=0.15cm, font=\sffamily, text=blue!80!black},
    every node/.style={outer sep=0pt}
]
% AAS1
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t1) at (0, 0) {AAS1};
\node[cell, below right=0cm and 0cm of t1.south west] (a1_1) {\underline{artist}};
\node[cell, right=0cm of a1_1] (a1_2) {artistCountry};
\node[cell, right=0cm of a1_2] (a1_3) {genre};

\draw[-latex, draw=red, thick] ($(a1_1.south)-(0, 0.3)$) -- ($(a1_1.south)$);
\draw[-latex, draw=red, thick] ($(a1_2.south)-(0, 0.3)$) -- ($(a1_2.south)$);
\draw[-latex, draw=red, thick] ($(a1_3.south)-(0, 0.3)$) -- ($(a1_3.south)$);
\draw[draw=red, thick] ($(a1_1.south)-(0, 0.3)$) -- ($(a1_3.south)-(0, 0.3)$);

% AAS3
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t3) at (8, 0) {AAS3};
\node[cell, below right=0cm and 0cm of t3.south west] (a3_1) {\underline{songTitle}};
\node[cell, right=0cm of a3_1] (a3_2) {songTrackNumber};
\node[cell, right=0cm of a3_2] (a3_3) {songGenre};
\node[cell, right=0cm of a3_3] (a3_4) {songLength};

\draw[-latex, draw=magenta, thick] ($(a3_1.south)-(0, 0.3)$) -- ($(a3_1.south)$);
\draw[-latex, draw=magenta, thick] ($(a3_2.south)-(0, 0.3)$) -- ($(a3_2.south)$);
\draw[-latex, draw=magenta, thick] ($(a3_3.south)-(0, 0.3)$) -- ($(a3_3.south)$);
\draw[-latex, draw=magenta, thick] ($(a3_4.south)-(0, 0.3)$) -- ($(a3_4.south)$);
\draw[draw=magenta, thick] ($(a3_1.south)-(0, 0.3)$) -- ($(a3_4.south)-(0, 0.3)$);

% AAS2
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t2) at (0, -2.5) {AAS2};
\node[cell, below right=0cm and 0cm of t2.south west] (a2_1) {\underline{albumName}};
\node[cell, right=0cm of a2_1] (a2_2) {releaseYear};
\node[cell, right=0cm of a2_2] (a2_3) {recordLabel};
\node[cell, right=0cm of a2_3] (a2_4) {albumLength};

\draw[-latex, draw=green!60!black, thick] ($(a2_1.south)-(0, 0.3)$) -- ($(a2_1.south)$);
\draw[-latex, draw=green!60!black, thick] ($(a2_2.south)-(0, 0.3)$) -- ($(a2_2.south)$);
\draw[-latex, draw=green!60!black, thick] ($(a2_3.south)-(0, 0.3)$) -- ($(a2_3.south)$);
\draw[-latex, draw=green!60!black, thick] ($(a2_4.south)-(0, 0.3)$) -- ($(a2_4.south)$);
\draw[draw=green!60!black, thick] ($(a2_1.south)-(0, 0.3)$) -- ($(a2_4.south)-(0, 0.3)$);

\end{tikzpicture}
}
\end{center}

\vspace{0.8cm}
\textbf{3NF :}\\
\vspace{0.2cm}
\begin{center}
\resizebox{0.9\textwidth}{!}{
\begin{tikzpicture}[
    cell/.style={draw, rectangle, minimum height=0.7cm, text centered, inner sep=0.15cm, font=\sffamily, text=blue!80!black},
    every node/.style={outer sep=0pt}
]
% AAS1
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t1) at (0, 0) {AAS1};
\node[cell, below right=0cm and 0cm of t1.south west] (a1_1) {\underline{artist}};
\node[cell, right=0cm of a1_1] (a1_2) {artistCountry};
\node[cell, right=0cm of a1_2] (a1_3) {genre};


% AAS3
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t3) at (8, 0) {AAS3};
\node[cell, below right=0cm and 0cm of t3.south west] (a3_1) {\underline{songTitle}};
\node[cell, right=0cm of a3_1] (a3_2) {songTrackNumber};
\node[cell, right=0cm of a3_2] (a3_3) {songGenre};
\node[cell, right=0cm of a3_3] (a3_4) {songLength};

% AAS2
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t2) at (0, -2.5) {AAS2};
\node[cell, below right=0cm and 0cm of t2.south west] (a2_1) {\underline{albumName}};
\node[cell, right=0cm of a2_1] (a2_2) {releaseYear};
\node[cell, right=0cm of a2_2] (a2_3) {recordLabel};
\node[cell, right=0cm of a2_3] (a2_4) {albumLength};

% AAS4
\node[anchor=south west, font=\sffamily\bfseries, text=blue!80!black] (t4) at (8, -2.5) {AAS4};
\node[cell, below right=0cm and 0cm of t4.south west] (a4_1) {\underline{artist}};
\node[cell, right=0cm of a4_1] (a4_2) {\underline{albumName}};
\node[cell, right=0cm of a4_2] (a4_3) {\underline{songTitle}};

% Red Links/Relations pointing BACK to the foreign keys
\draw[-latex, draw=red!80!black, thick] (a4_1.south) -- +(0,-0.6) -| (a1_1.south);
\draw[-latex, draw=red!80!black, thick] (a4_2.south) -- +(0,-0.8) -| (a2_1.south);
\draw[-latex, draw=red!80!black, thick] (a4_3.south) -- +(0,-0.4) -| (a3_1.south);

\end{tikzpicture}
}
\end{center}

\end{document}
'''

tex_file_path = os.path.join(os.path.dirname(__file__), 'Lab06_Normalization_TikZ.tex')
with open(tex_file_path, 'w', encoding='utf-8') as f:
    f.write(tex_content)
    print("Success: Generated full LaTeX file including Table 1 and Table 2")
