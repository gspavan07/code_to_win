import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerContainer: {
    backgroundColor: "#3370ff",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
    marginLeft: 10,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    display: "flex",
    backgroundColor: "#ffffff4e",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginBottom: 10,
  },
  avatar: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
  },
  info: {
    marginBottom: 15,
    marginLeft: 10,
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
  },
  infoTable: {
    width: "100%",
    display: "flex",
    marginLeft: 30,
    justifyContent: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  tableHeader: {
    fontSize: 15,
    color: "#ffffffd6",
    width: "20%",
    textAlign: "left",
  },
  tableCell: {
    fontSize: 15,
    width: "20%",
    color: "#fff",
    textAlign: "left",
  },

  statsContainer: {
    display: "flex",
    gap: 20,
    flexDirection: "row",
    width: "100%",
    marginBottom: 15,
  },
  statBox: {
    backgroundColor: "#eff6ff",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "33.33%",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "left",
    borderRadius: 10,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 5,
  },
  breakdown: {
    fontSize: 12,
  },
});

const PDFDocument = ({ student }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.logoContainer}>
          <Image src="/public/title_head.jpg" />
        </View>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{student?.name?.charAt(0)}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{student?.name}</Text>
              <Text style={styles.roll}>{student?.student_id}</Text>
            </View>
          </View>
          {/* Student Info Table */}
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

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {student?.performance?.combined?.totalSolved || "NaN"}
            </Text>
            <Text style={styles.statLabel}>Total Problems</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {student?.performance?.combined?.totalContests || "NaN"}
            </Text>
            <Text style={styles.statLabel}>Total Contests</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{student?.score || "NaN"}</Text>
            <Text style={styles.statLabel}>Grand Total</Text>
          </View>
        </View>

        {/* Platform Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LeetCode</Text>
          <Text style={styles.statValue}>
            {student?.performance?.platformWise?.leetcode?.easy +
              student?.performance?.platformWise?.leetcode?.medium +
              student?.performance?.platformWise?.leetcode?.hard || 0}
          </Text>
          <Text style={styles.statLabel}>Problems Solved</Text>
          <Text style={styles.breakdown}>
            <Text>
              Easy: {student?.performance?.platformWise?.leetcode?.easy || 0}
            </Text>
            <Text>
              Medium:
              {student?.performance?.platformWise?.leetcode?.medium || 0}
            </Text>
            <Text>
              Hard:{student?.performance?.platformWise?.leetcode?.hard || 0}
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CodeChef</Text>
          <Text style={styles.statValue}>
            {student?.performance?.platformWise?.codechef?.contests || 0}
          </Text>
          <Text style={styles.statLabel}>Contests Participated</Text>
          <Text style={styles.breakdown}>
            Easy: {student?.performance?.platformWise?.codechef?.problems || 0}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GeeksforGeeks</Text>
          <Text style={styles.statValue}>
            {student?.performance?.platformWise?.gfg?.school +
              student?.performance?.platformWise?.gfg?.basic +
              student?.performance?.platformWise?.gfg?.easy +
              student?.performance?.platformWise?.gfg?.medium +
              student?.performance?.platformWise?.gfg?.hard || 0}
          </Text>
          <Text style={styles.statLabel}>Problems Solved</Text>
          <Text style={styles.breakdown}>
            <Text>
              School: {student?.performance?.platformWise?.gfg?.school || 0}{" "}
            </Text>
            <Text>
              Basic: {student?.performance?.platformWise?.gfg?.basic || 0}{" "}
            </Text>
            <Text>
              Easy: {student?.performance?.platformWise?.gfg?.easy || 0}{" "}
            </Text>
            <Text>
              Medium: {student?.performance?.platformWise?.gfg?.medium || 0}{" "}
            </Text>
            <Text>
              Hard: {student?.performance?.platformWise?.gfg?.hard || 0}
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HackerRank</Text>
          <Text style={styles.statValue}>
            {student?.performance?.platformWise?.hackerrank?.badges || 0}
          </Text>
          <Text style={styles.statLabel}>Badges Gained</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
