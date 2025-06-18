import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "/title_head.jpg";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
    backgroundColor: "#f0f4f8",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerContainer: {
    backgroundColor: "#1e3a8a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginRight: 15,
    border: "2 solid white",
  },
  avatar: {
    color: "white",
    fontWeight: "bold",
    fontSize: 28,
  },
  info: {
    justifyContent: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  roll: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
    backgroundColor: "#60a5fa",
    fontWeight: "bold",
    color: "white",
    width: 85,
    textAlign: "center",
    marginTop: 5,
  },
  infoTable: {
    marginLeft: 10,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  tableHeader: {
    fontSize: 12,
    color: "#cbd5e1",
    width: "20%",
  },
  tableCell: {
    fontSize: 12,
    color: "#e0f2fe",
    width: "20%",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 12,
    width: "32%",
    alignItems: "center",
    color: "white",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 12,
    color: "#dbeafe",
  },
  statsCard: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  section: {
    flex: 1,
    backgroundColor: "#fef9c3",
    padding: 12,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ca8a04",
    marginBottom: 6,
  },
  breakdown: {
    fontSize: 12,
    marginTop: 5,
    color: "#78350f",
  },
});

const PDFDocument = ({ student }) => {
  const leet = student?.performance?.platformWise?.leetcode || {};
  const gfg = student?.performance?.platformWise?.gfg || {};
  const codechef = student?.performance?.platformWise?.codechef || {};
  const hackerrank = student?.performance?.platformWise?.hackerrank || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.logoContainer}>
          <Image src={logo} />
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{student?.name?.charAt(0) || "S"}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{student?.name}</Text>
              <Text style={styles.roll}>{student?.student_id}</Text>
            </View>
          </View>
          <View style={styles.infoTable}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Campus</Text>
              <Text style={styles.tableHeader}>Section</Text>
              <Text style={styles.tableHeader}>Year</Text>
              <Text style={styles.tableHeader}>Department</Text>
              <Text style={styles.tableHeader}>Degree</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{student?.college || "AEC"}</Text>
              <Text style={styles.tableCell}>{student?.section || "A"}</Text>
              <Text style={styles.tableCell}>{student?.year || "3"}</Text>
              <Text style={styles.tableCell}>{student?.dept_name || "AML"}</Text>
              <Text style={styles.tableCell}>{student?.degree || "B Tech"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{student?.performance?.combined?.totalSolved || 0}</Text>
            <Text style={styles.statLabel}>Total Problems</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{student?.performance?.combined?.totalContests || 0}</Text>
            <Text style={styles.statLabel}>Total Contests</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{student?.score ?? 0}</Text>
            <Text style={styles.statLabel}>Grand Total</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LeetCode</Text>
            <Text style={styles.statValue}>{(leet.easy || 0) + (leet.medium || 0) + (leet.hard || 0)}</Text>
            <Text style={styles.statLabel}>Problems Solved</Text>
            <Text style={styles.breakdown}>
              Easy: {leet?.easy || 0}, Medium: {leet.medium || 0}, Hard: {leet.hard || 0}, Contest: {leet.contests || 0}, Badges: {leet.badges || 0}
            </Text>
          </View>

          <View style={{ ...styles.section, backgroundColor: "#fce7f3" }}>
            <Text style={{ ...styles.sectionTitle, color: "#db2777" }}>CodeChef</Text>
            <Text style={styles.statValue}>{codechef.contests ?? 0}</Text>
            <Text style={styles.statLabel}>Contests Participated</Text>
            <Text style={styles.breakdown}>
              Problems Solved: {codechef.problems || 0}, Star: {codechef.stars || 0}, Badges: {codechef.badges || 0}
            </Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={{ ...styles.section, backgroundColor: "#dcfce7" }}>
            <Text style={{ ...styles.sectionTitle, color: "#15803d" }}>GeeksforGeeks</Text>
            <Text style={styles.statValue}>{(gfg.school || 0) + (gfg.basic || 0) + (gfg.easy || 0) + (gfg.medium || 0) + (gfg.hard || 0)}</Text>
            <Text style={styles.statLabel}>Problems Solved</Text>
            <Text style={styles.breakdown}>
              School: {gfg.school || 0}, Basic: {gfg.basic || 0}, Easy: {gfg.easy || 0}, Medium: {gfg.medium || 0}, Hard: {gfg.hard || 0}
            </Text>
          </View>

          <View style={{ ...styles.section, backgroundColor: "#dbeafe" }}>
            <Text style={{ ...styles.sectionTitle, color: "#1d4ed8" }}>Hacker Rank</Text>
            <Text style={styles.statValue}>{hackerrank.badges || 0}</Text>
            <Text style={styles.statLabel}>Badges Gained</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
