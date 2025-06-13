import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "/title_head.jpg"; // ✅ Ensure image is imported

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerContainer: {
    backgroundColor: "#3370ff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#ffffff4e",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginRight: 10,
  },
  avatar: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
  },
  info: {
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  roll: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 50,
    backgroundColor: "#ffffff4e",
    fontWeight: "bold",
    color: "white",
    width: 80,
    textAlign: "center",
    marginTop: 5,
  },
  infoTable: {
    marginLeft: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  tableHeader: {
    fontSize: 13,
    color: "#ffffffd6",
    width: "20%",
  },
  tableCell: {
    fontSize: 13,
    color: "#fff",
    width: "20%",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statBox: {
    backgroundColor: "#eff6ff",
    padding: 10,
    borderRadius: 10,
    width: "32%",
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
    backgroundColor: "#eff6ff",
    padding: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  breakdown: {
    fontSize: 12,
    marginTop: 5,
  },
});

const PDFDocument = ({ student, stdDetails }) => {
  const leet = stdDetails?.performance?.platformWise?.leetcode || {};
  const gfg = stdDetails?.performance?.platformWise?.gfg || {};
  const codechef = stdDetails?.performance?.platformWise?.codechef || {};
  const hackerrank = stdDetails?.performance?.platformWise?.hackerrank || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title Image */}
        <View style={styles.logoContainer}>
          <Image src={logo} />
        </View>

        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>
                {student?.name?.charAt(0) || "S"}
              </Text>
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
              <Text style={styles.tableCell}>
                {student?.dept_name || "AML"}
              </Text>
              <Text style={styles.tableCell}>
                {student?.degree || "B Tech"}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {stdDetails?.performance?.combined?.totalSolved ?? 0}
            </Text>
            <Text style={styles.statLabel}>Total Problems</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {stdDetails?.performance?.combined?.totalContests ?? 0}
            </Text>
            <Text style={styles.statLabel}>Total Contests</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{student?.score ?? 0}</Text>
            <Text style={styles.statLabel}>Grand Total</Text>
          </View>
        </View>

        {/* LeetCode Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LeetCode</Text>
          <Text style={styles.statValue}>
            {(leet.easy || 0) + (leet.medium || 0) + (leet.hard || 0)}
          </Text>
          <Text style={styles.statLabel}>Problems Solved</Text>
          <Text style={styles.breakdown}>
            Easy: {leet.easy || 0}, Medium: {leet.medium || 0}, Hard:{" "}
            {leet.hard || 0}
          </Text>
        </View>

        {/* CodeChef Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CodeChef</Text>
          <Text style={styles.statValue}>{codechef.contests ?? 0}</Text>
          <Text style={styles.statLabel}>Contests Participated</Text>
          <Text style={styles.breakdown}>
            Problems Solved: {codechef.problems || 0}
          </Text>
        </View>

        {/* GeeksforGeeks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GeeksforGeeks</Text>
          <Text style={styles.statValue}>
            {(gfg.school || 0) +
              (gfg.basic || 0) +
              (gfg.easy || 0) +
              (gfg.medium || 0) +
              (gfg.hard || 0)}
          </Text>
          <Text style={styles.statLabel}>Problems Solved</Text>
          <Text style={styles.breakdown}>
            School: {gfg.school || 0}, Basic: {gfg.basic || 0}, Easy:{" "}
            {gfg.easy || 0}, Medium: {gfg.medium || 0}, Hard: {gfg.hard || 0}
          </Text>
        </View>

        {/* HackerRank Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GeeksforGeeks Badges</Text>
          <Text style={styles.statValue}>{hackerrank.badges || 0}</Text>
          <Text style={styles.statLabel}>Badges Gained</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
